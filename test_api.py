#!/usr/bin/env python3
"""
Simple test script to verify Lensify API functionality
Run this script while the backend server is running to test all endpoints
"""

import requests
import sys
from io import BytesIO
from PIL import Image

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:8000/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✅ Health check passed")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_effects_endpoint():
    """Test the effects list endpoint"""
    try:
        response = requests.get("http://localhost:8000/effects")
        assert response.status_code == 200
        data = response.json()
        assert "effects" in data
        assert len(data["effects"]) == 8
        expected_effects = ["vintage", "black_white", "cinematic", "lomo", "warm", "cool", "sharp", "soft"]
        for effect in expected_effects:
            assert effect in data["effects"]
        print("✅ Effects endpoint passed")
        print(f"   Available effects: {', '.join(data['effects'])}")
        return True
    except Exception as e:
        print(f"❌ Effects endpoint failed: {e}")
        return False

def create_test_image():
    """Create a simple test image in memory"""
    # Create a 100x100 RGB image with a gradient
    img = Image.new('RGB', (100, 100), color='white')
    pixels = img.load()
    
    for i in range(100):
        for j in range(100):
            pixels[i, j] = (i * 2, j * 2, (i + j) % 255)
    
    # Convert to bytes
    img_bytes = BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    return img_bytes

def test_apply_effect():
    """Test applying an effect to a single image"""
    try:
        # Create test image
        test_image = create_test_image()
        
        # Test with vintage effect
        files = {'files': ('test.jpg', test_image, 'image/jpeg')}
        data = {'effect': 'vintage'}
        
        response = requests.post("http://localhost:8000/apply-effect", files=files, data=data)
        assert response.status_code == 200
        assert response.headers['content-type'] == 'image/jpeg'
        assert len(response.content) > 0
        
        print("✅ Single image effect application passed")
        print(f"   Response size: {len(response.content)} bytes")
        return True
    except Exception as e:
        print(f"❌ Single image effect application failed: {e}")
        return False

def test_batch_processing():
    """Test applying an effect to multiple images"""
    try:
        # Create two test images
        test_image1 = create_test_image()
        test_image2 = create_test_image()
        
        files = [
            ('files', ('test1.jpg', test_image1, 'image/jpeg')),
            ('files', ('test2.jpg', test_image2, 'image/jpeg'))
        ]
        data = {'effect': 'black_white'}
        
        response = requests.post("http://localhost:8000/apply-effect", files=files, data=data)
        assert response.status_code == 200
        assert response.headers['content-type'] == 'application/zip'
        assert len(response.content) > 0
        
        print("✅ Batch processing passed")
        print(f"   ZIP file size: {len(response.content)} bytes")
        return True
    except Exception as e:
        print(f"❌ Batch processing failed: {e}")
        return False

def test_invalid_effect():
    """Test error handling with invalid effect"""
    try:
        test_image = create_test_image()
        files = {'files': ('test.jpg', test_image, 'image/jpeg')}
        data = {'effect': 'invalid_effect'}
        
        response = requests.post("http://localhost:8000/apply-effect", files=files, data=data)
        assert response.status_code == 400
        error_data = response.json()
        assert "detail" in error_data
        
        print("✅ Error handling passed")
        print(f"   Error message: {error_data['detail']}")
        return True
    except Exception as e:
        print(f"❌ Error handling failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Lensify API")
    print("=" * 50)
    
    tests = [
        test_health_check,
        test_effects_endpoint,
        test_apply_effect,
        test_batch_processing,
        test_invalid_effect
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")
        print()
    
    print("=" * 50)
    print(f"🎯 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the backend server and try again.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
