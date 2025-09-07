# Lensify API Documentation

## Base URL
```
http://localhost:8000
```

## Endpoints

### GET /
Health check endpoint to verify the API is running.

**Response:**
```json
{
  "message": "Lensify API is running!"
}
```

### GET /effects
Get list of all available effects.

**Response:**
```json
{
  "effects": [
    "vintage",
    "black_white", 
    "cinematic",
    "lomo",
    "warm",
    "cool",
    "sharp",
    "soft"
  ]
}
```

### POST /apply-effect
Apply an effect to one or more uploaded images.

**Parameters:**
- `effect` (form field): The effect to apply (one of the effects from GET /effects)
- `files` (file upload): One or more image files

**Request Example:**
```bash
curl -X POST "http://localhost:8000/apply-effect" \
  -F "effect=vintage" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg"
```

**Response:**
- Single image: Returns the processed image directly as JPEG
- Multiple images: Returns a ZIP file containing all processed images

**Response Headers:**
- Single image: `Content-Disposition: attachment; filename=processed_[original_filename]`
- Multiple images: `Content-Disposition: attachment; filename=lensify_processed_images.zip`

## Effect Descriptions

| Effect | Description |
|--------|-------------|
| `vintage` | Warm sepia tone with reduced saturation |
| `black_white` | Classic monochrome conversion |
| `cinematic` | High contrast with moody tones |
| `lomo` | Saturated colors with dark vignette |
| `warm` | Enhanced reds for cozy feeling |
| `cool` | Enhanced blues for crisp look |
| `sharp` | Enhanced edge definition |
| `soft` | Gentle blur for dreamy effect |

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK`: Success
- `400 Bad Request`: Invalid effect name or no files uploaded
- `500 Internal Server Error`: Server error during processing

Error responses include a JSON object with a `detail` field describing the error.

## CORS

The API is configured to accept requests from `http://localhost:5173` (the default Vite development server port) for development purposes.
