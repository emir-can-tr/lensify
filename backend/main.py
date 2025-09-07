from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List
import io
import zipfile
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import uvicorn

app = FastAPI(title="Lensify API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Image effects
class ImageEffects:
    @staticmethod
    def vintage(image: Image.Image) -> Image.Image:
        """Apply vintage effect"""
        # Reduce saturation
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(0.8)
        
        # Add sepia tone
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image)
        # Sepia transformation matrix
        sepia_filter = np.array([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131]
        ])
        
        sepia_img = pixels @ sepia_filter.T
        sepia_img = np.clip(sepia_img, 0, 255)
        
        return Image.fromarray(sepia_img.astype(np.uint8))
    
    @staticmethod
    def black_white(image: Image.Image) -> Image.Image:
        """Convert to black and white"""
        return image.convert("L").convert("RGB")
    
    @staticmethod
    def cinematic(image: Image.Image) -> Image.Image:
        """Apply cinematic effect"""
        # Increase contrast and reduce brightness slightly
        contrast = ImageEnhance.Contrast(image)
        image = contrast.enhance(1.2)
        
        brightness = ImageEnhance.Brightness(image)
        image = brightness.enhance(0.9)
        
        return image
    
    @staticmethod
    def lomo(image: Image.Image) -> Image.Image:
        """Apply lomo effect"""
        # Increase saturation and add vignette effect
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.5)
        
        # Darken edges (simple vignette)
        width, height = image.size
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image)
        
        # Create vignette mask
        Y, X = np.ogrid[:height, :width]
        center_x, center_y = width // 2, height // 2
        mask = np.sqrt((X - center_x)**2 + (Y - center_y)**2)
        mask = mask / mask.max()
        mask = np.clip(1.2 - mask, 0.6, 1.0)
        
        # Apply vignette
        for i in range(3):
            pixels[:, :, i] = pixels[:, :, i] * mask
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def warm(image: Image.Image) -> Image.Image:
        """Apply warm filter"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        # Warm filter: enhance reds and reduce blues
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 1.1, 0, 255)  # Red
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 0.9, 0, 255)  # Blue
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def cool(image: Image.Image) -> Image.Image:
        """Apply cool filter"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        # Cool filter: enhance blues and reduce reds
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 0.9, 0, 255)  # Red
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 1.1, 0, 255)  # Blue
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def sharp(image: Image.Image) -> Image.Image:
        """Apply sharpening filter"""
        return image.filter(ImageFilter.SHARPEN)
    
    @staticmethod
    def soft(image: Image.Image) -> Image.Image:
        """Apply soft/blur filter"""
        return image.filter(ImageFilter.BLUR)

# Available effects
EFFECTS = {
    "vintage": ImageEffects.vintage,
    "black_white": ImageEffects.black_white,
    "cinematic": ImageEffects.cinematic,
    "lomo": ImageEffects.lomo,
    "warm": ImageEffects.warm,
    "cool": ImageEffects.cool,
    "sharp": ImageEffects.sharp,
    "soft": ImageEffects.soft,
}

@app.get("/")
async def root():
    return {"message": "Lensify API is running!"}

@app.get("/effects")
async def get_effects():
    """Get list of available effects"""
    return {"effects": list(EFFECTS.keys())}

@app.post("/apply-effect")
async def apply_effect(
    effect: str,
    files: List[UploadFile] = File(...)
):
    """Apply effect to uploaded images"""
    if effect not in EFFECTS:
        raise HTTPException(status_code=400, detail=f"Effect '{effect}' not found")
    
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    # Process images
    processed_images = []
    
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
        
        try:
            # Read and process image
            image_data = await file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # Apply effect
            processed_image = EFFECTS[effect](image)
            
            # Convert to bytes
            img_bytes = io.BytesIO()
            processed_image.save(img_bytes, format="JPEG", quality=95)
            img_bytes.seek(0)
            
            processed_images.append({
                "filename": file.filename,
                "data": img_bytes.getvalue()
            })
            
        except Exception as e:
            print(f"Error processing {file.filename}: {e}")
            continue
    
    if not processed_images:
        raise HTTPException(status_code=400, detail="No valid images processed")
    
    # If single image, return it directly
    if len(processed_images) == 1:
        return StreamingResponse(
            io.BytesIO(processed_images[0]["data"]),
            media_type="image/jpeg",
            headers={"Content-Disposition": f"attachment; filename=processed_{processed_images[0]['filename']}"}
        )
    
    # Multiple images, create ZIP
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for img in processed_images:
            filename = f"processed_{img['filename']}"
            zip_file.writestr(filename, img["data"])
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=lensify_processed_images.zip"}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
