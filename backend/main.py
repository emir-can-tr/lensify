from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import List
import io
import zipfile
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
import uvicorn
import os

app = FastAPI(title="Lensify API", version="1.0.0")

# Configure CORS - Get allowed origins from environment
allowed_origins = os.getenv(
    "CORS_ORIGINS", 
    "http://localhost:5173,http://localhost:5174,https://lensify-uq6i.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
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
    
    @staticmethod
    def analog_kodak(image: Image.Image) -> Image.Image:
        """Apply Kodak film analog effect"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        
        # Kodak color grading - warmer tones, enhanced contrast
        # Boost reds and oranges, slightly desaturate blues
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 1.15 + 10, 0, 255)  # Red boost
        pixels[:, :, 1] = np.clip(pixels[:, :, 1] * 1.05 + 5, 0, 255)   # Slight green boost
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 0.92 - 5, 0, 255)   # Blue reduction
        
        # Add film grain
        height, width = pixels.shape[:2]
        grain = np.random.normal(0, 8, (height, width, 3))
        pixels = np.clip(pixels + grain, 0, 255)
        
        # Slight contrast boost
        pixels = np.clip((pixels - 128) * 1.1 + 128, 0, 255)
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def analog_fuji(image: Image.Image) -> Image.Image:
        """Apply Fuji film analog effect"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        
        # Fuji color grading - cooler tones, enhanced greens
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 0.95, 0, 255)      # Slight red reduction
        pixels[:, :, 1] = np.clip(pixels[:, :, 1] * 1.12 + 8, 0, 255)  # Green boost
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 1.08 + 5, 0, 255)  # Blue boost
        
        # Add fine film grain
        height, width = pixels.shape[:2]
        grain = np.random.normal(0, 6, (height, width, 3))
        pixels = np.clip(pixels + grain, 0, 255)
        
        # Subtle saturation boost
        img_temp = Image.fromarray(pixels.astype(np.uint8))
        enhancer = ImageEnhance.Color(img_temp)
        img_temp = enhancer.enhance(1.15)
        
        return img_temp
    
    @staticmethod
    def analog_polaroid(image: Image.Image) -> Image.Image:
        """Apply Polaroid instant film effect"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        height, width = pixels.shape[:2]
        
        # Polaroid characteristic warm color cast
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 1.08 + 12, 0, 255)  # Warm red
        pixels[:, :, 1] = np.clip(pixels[:, :, 1] * 1.03 + 8, 0, 255)   # Slight yellow
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 0.88 - 8, 0, 255)   # Reduced blue
        
        # Add characteristic Polaroid border fade
        Y, X = np.ogrid[:height, :width]
        center_x, center_y = width // 2, height // 2
        
        # Create border fade effect
        border_fade = np.minimum(
            np.minimum(X, width - X),
            np.minimum(Y, height - Y)
        )
        border_fade = border_fade.astype(float) / min(width, height) * 4
        border_fade = np.clip(border_fade, 0.7, 1.0)
        
        for i in range(3):
            pixels[:, :, i] = pixels[:, :, i] * border_fade
        
        # Add coarse grain for instant film texture
        grain = np.random.normal(0, 12, (height, width, 3))
        pixels = np.clip(pixels + grain, 0, 255)
        
        # Slight overexposure effect
        pixels = np.clip(pixels * 1.05 + 10, 0, 255)
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def analog_expired(image: Image.Image) -> Image.Image:
        """Apply expired film effect with color shifts and artifacts"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        height, width = pixels.shape[:2]
        
        # Expired film color shifts - magenta/green cast
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 1.12 + 15, 0, 255)  # Red/magenta boost
        pixels[:, :, 1] = np.clip(pixels[:, :, 1] * 0.92 - 10, 0, 255)  # Green reduction
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 1.05 + 5, 0, 255)   # Slight blue boost
        
        # Add random light leaks
        leak_intensity = np.random.uniform(20, 40)
        leak_x = np.random.randint(0, width)
        leak_y = np.random.randint(0, height)
        leak_radius = min(width, height) // 4
        
        Y, X = np.ogrid[:height, :width]
        leak_mask = (X - leak_x)**2 + (Y - leak_y)**2 <= leak_radius**2
        
        # Apply light leak
        pixels[leak_mask, 0] = np.clip(pixels[leak_mask, 0] + leak_intensity, 0, 255)
        pixels[leak_mask, 1] = np.clip(pixels[leak_mask, 1] + leak_intensity * 0.7, 0, 255)
        
        # Heavy grain and scratches
        grain = np.random.normal(0, 15, (height, width, 3))
        pixels = np.clip(pixels + grain, 0, 255)
        
        # Random vertical scratches
        for _ in range(np.random.randint(2, 6)):
            scratch_x = np.random.randint(0, width)
            scratch_width = np.random.randint(1, 3)
            scratch_intensity = np.random.uniform(30, 60)
            
            end_x = min(scratch_x + scratch_width, width)
            pixels[:, scratch_x:end_x, :] = np.clip(
                pixels[:, scratch_x:end_x, :] + scratch_intensity, 0, 255
            )
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def analog_cross_process(image: Image.Image) -> Image.Image:
        """Apply cross-processing effect (developing slide film in print chemicals)"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        
        # Cross-processing color inversion characteristics
        # Boost contrast in highlights, compress shadows
        pixels = pixels / 255.0  # Normalize to 0-1
        
        # Apply characteristic S-curve to each channel differently
        # Red channel - boost highlights
        pixels[:, :, 0] = np.power(pixels[:, :, 0], 0.8)
        pixels[:, :, 0] = np.clip(pixels[:, :, 0] * 1.3, 0, 1)
        
        # Green channel - compress midtones
        pixels[:, :, 1] = np.power(pixels[:, :, 1], 1.4)
        pixels[:, :, 1] = np.clip(pixels[:, :, 1] * 0.9 + 0.1, 0, 1)
        
        # Blue channel - boost shadows
        pixels[:, :, 2] = np.power(pixels[:, :, 2], 1.1)
        pixels[:, :, 2] = np.clip(pixels[:, :, 2] * 1.1 + 0.05, 0, 1)
        
        pixels = pixels * 255.0  # Back to 0-255
        
        # Add slight grain
        height, width = pixels.shape[:2]
        grain = np.random.normal(0, 5, (height, width, 3))
        pixels = np.clip(pixels + grain, 0, 255)
        
        return Image.fromarray(pixels.astype(np.uint8))
    
    @staticmethod
    def analog_light_leak(image: Image.Image) -> Image.Image:
        """Apply light leak effect with orange/red casting"""
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        pixels = np.array(image).astype(float)
        height, width = pixels.shape[:2]
        
        # Create multiple light leaks
        for _ in range(np.random.randint(1, 3)):
            leak_intensity = np.random.uniform(40, 80)
            
            # Random corner or edge placement
            corner = np.random.choice(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'edge'])
            
            if corner == 'top-left':
                leak_center = (height // 4, width // 4)
            elif corner == 'top-right':
                leak_center = (height // 4, 3 * width // 4)
            elif corner == 'bottom-left':
                leak_center = (3 * height // 4, width // 4)
            elif corner == 'bottom-right':
                leak_center = (3 * height // 4, 3 * width // 4)
            else:  # edge
                if np.random.random() > 0.5:  # vertical edge
                    leak_center = (np.random.randint(0, height), 0 if np.random.random() > 0.5 else width-1)
                else:  # horizontal edge
                    leak_center = (0 if np.random.random() > 0.5 else height-1, np.random.randint(0, width))
            
            # Create gradient for light leak
            Y, X = np.ogrid[:height, :width]
            distance = np.sqrt((Y - leak_center[0])**2 + (X - leak_center[1])**2)
            max_distance = np.sqrt(height**2 + width**2) / 3
            
            leak_mask = np.exp(-distance / max_distance) * leak_intensity
            
            # Apply warm light leak (orange/red)
            pixels[:, :, 0] = np.clip(pixels[:, :, 0] + leak_mask, 0, 255)
            pixels[:, :, 1] = np.clip(pixels[:, :, 1] + leak_mask * 0.6, 0, 255)
            pixels[:, :, 2] = np.clip(pixels[:, :, 2] + leak_mask * 0.2, 0, 255)
        
        # Add subtle grain
        grain = np.random.normal(0, 4, (height, width, 3))
        pixels = np.clip(pixels + grain, 0, 255)
        
        return Image.fromarray(pixels.astype(np.uint8))

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
    "analog_kodak": ImageEffects.analog_kodak,
    "analog_fuji": ImageEffects.analog_fuji,
    "analog_polaroid": ImageEffects.analog_polaroid,
    "analog_expired": ImageEffects.analog_expired,
    "analog_cross_process": ImageEffects.analog_cross_process,
    "analog_light_leak": ImageEffects.analog_light_leak,
}

@app.get("/")
async def root():
    return {"message": "Lensify API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Lensify API"}

@app.get("/effects")
async def get_effects():
    """Get list of available effects"""
    return {"effects": list(EFFECTS.keys())}

@app.post("/apply-effect")
async def apply_effect(
    effect: str = Form(...),
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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
