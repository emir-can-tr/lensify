# 🚀 Getting Started with Lensify

**Lensify** is a web application that allows users to apply high-quality, artistic camera effects to their photos with batch processing support.

## 📋 Prerequisites

- **Python 3.8+** (Download from [python.org](https://python.org))
- **Node.js 16+** (Download from [nodejs.org](https://nodejs.org))
- **Git** (Download from [git-scm.com](https://git-scm.com))

## 🏃‍♂️ Quick Start

### Option 1: Automatic Setup (Recommended)
```powershell
# Clone the repository
git clone https://github.com/emir-can-tr/lensify.git
cd lensify

# Run the development script
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

### Option 2: Manual Setup

1. **Setup Backend:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate     # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   python main.py
   ```

2. **Setup Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌐 Access the Application

- **Frontend:** http://localhost:5173 or http://localhost:5174
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (FastAPI auto-docs)

## 🎯 How to Use

1. **Upload Photos:** Drag & drop or click to select multiple images
2. **Select Effect:** Choose from 8 professional effects in the gallery
3. **Preview:** See the effect applied to your active photo in real-time
4. **Process:** Click "Apply to All & Download ZIP" for batch processing
5. **Download:** Your processed images will download automatically

## 🎨 Available Effects

| Effect | Description |
|--------|-------------|
| **Vintage** | Warm sepia tone with reduced saturation |
| **Black & White** | Classic monochrome conversion |
| **Cinematic** | High contrast with moody tones |
| **Lomo** | Saturated colors with dark vignette |
| **Warm** | Enhanced reds for cozy feeling |
| **Cool** | Enhanced blues for crisp look |
| **Sharp** | Enhanced edge definition |
| **Soft** | Gentle blur for dreamy effect |

## 🛠️ Troubleshooting

### Common Issues

**1. "Port 5173 is in use"**
- The frontend will automatically try port 5174
- Update `CORS_ORIGINS` in `backend/main.py` if needed

**2. Tailwind CSS PostCSS Error**
- Already fixed! The PostCSS configuration has been updated
- Make sure you have the latest code: `git pull origin main`

**3. API Connection Failed**
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `frontend/.env` has correct API URL

**4. Python/Node.js Not Found**
- Install Python 3.8+ and Node.js 16+
- Add them to your system PATH
- Restart your terminal after installation

**5. Module Not Found Errors**
- Backend: `venv\Scripts\activate` then `pip install -r requirements.txt`
- Frontend: `npm install`

### Testing the API

Run the test suite to verify everything works:
```bash
# Make sure backend is running first
cd backend
venv\Scripts\activate
python main.py

# In another terminal, run tests
python test_api.py
```

## 📁 Project Structure

```
lensify/
├── frontend/              # React + TypeScript app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/        # Redux state management
│   │   └── ...
│   ├── .env              # Environment variables
│   └── package.json
├── backend/               # FastAPI Python server
│   ├── main.py           # API endpoints & image processing
│   ├── requirements.txt  # Python dependencies
│   └── venv/            # Virtual environment
├── API.md                # API documentation
├── DEPLOYMENT.md         # Production deployment guide
├── test_api.py          # API test suite
└── start-dev.ps1        # Development startup script
```

## 🚀 Development

### Making Changes

1. **Frontend changes:** Edit files in `frontend/src/`, changes auto-reload
2. **Backend changes:** Edit `backend/main.py`, restart server with `Ctrl+C` then `python main.py`
3. **New effects:** Add to `EFFECTS` dictionary in `backend/main.py`

### Git Workflow

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

## 🌟 Features

✅ **Batch Processing:** Upload and process multiple photos at once  
✅ **Real-time Preview:** See effects instantly before processing  
✅ **Professional Effects:** 8 high-quality image filters  
✅ **ZIP Download:** Automatic packaging of processed images  
✅ **Responsive Design:** Works on desktop and mobile  
✅ **Drag & Drop:** Intuitive file upload interface  
✅ **Progress Indicators:** Visual feedback during processing  
✅ **Error Handling:** Proper validation and user feedback  

## 📚 Documentation

- **API Documentation:** [API.md](API.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Main README:** [README.md](README.md)

## 🆘 Need Help?

1. Check this troubleshooting section first
2. Run `python test_api.py` to verify API functionality
3. Check the browser console for frontend errors
4. Review the terminal output for backend errors
5. Ensure all dependencies are installed correctly

## 🎉 You're Ready!

Open http://localhost:5173 in your browser and start transforming your photos with Lensify!
