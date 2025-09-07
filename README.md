# 🎨 Lensify - Instant Photo Effects

**Transform Your Photos Instantly with Professional-Grade Effects**

A powerful, user-friendly photo processing application that brings professional analog camera effects to your digital photos. With 14 premium effects including vintage film stocks, cross-processing, and light leaks, you can batch process multiple photos and download them instantly.

![Lensify](https://img.shields.io/badge/Status-Ready-brightgreen) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-19+-cyan)

## ✨ Features

- 🎬 **14 Premium Effects**: Including Vintage, Cinematic, Analog Film stocks (Kodak, Fuji, Polaroid), and more
- 🚀 **Batch Processing**: Apply effects to multiple photos simultaneously
- ⚡ **Real-time Preview**: See effects applied instantly before processing
- 📦 **ZIP Download**: Automatically packages multiple processed images
- 🎨 **Authentic Film Effects**: Realistic grain, color grading, and artifacts
- 💫 **Professional Quality**: High-resolution output with customizable settings
- 🌐 **Cross-Platform**: Works on Windows, macOS, and Linux

💼 **Available Effects**

| Effect | Description | Style |
|--------|-------------|--------|
| **Vintage** | Warm sepia tone with reduced saturation | Classic |
| **Black & White** | Professional monochrome conversion | Timeless |
| **Cinematic** | High contrast with moody tones | Dramatic |
| **Lomo** | Saturated colors with dark vignette | Retro |
| **Warm** | Enhanced reds for cozy feeling | Cozy |
| **Cool** | Enhanced blues for crisp look | Fresh |
| **Sharp** | Enhanced edge definition | Professional |
| **Soft** | Gentle blur for dreamy effect | Dreamy |
| **Kodak Film** | Classic warm film stock with grain | Authentic |
| **Fuji Film** | Cool tones with enhanced greens | Natural |
| **Polaroid** | Instant film with warm cast | Nostalgic |
| **Expired Film** | Degraded film with color shifts | Artistic |
| **Cross Process** | Inverted color processing effect | Experimental |
| **Light Leak** | Film exposure with orange glow | Atmospheric |

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### Windows
```bash
# Download and run the setup script
.\setup-windows.bat
# Or use PowerShell
.\setup-windows.ps1

# Start the application
.\start-windows.bat
```

#### macOS / Linux
```bash
# Make scripts executable
chmod +x setup-unix.sh start-unix.sh

# Run setup
./setup-unix.sh

# Start the application
./start-unix.sh
```

### Option 2: Manual Setup

#### Prerequisites
- **Python 3.8+** - [Download here](https://python.org)
- **Node.js 18+** - [Download here](https://nodejs.org)
- **Git** - [Download here](https://git-scm.com)

#### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lensify
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment**
   ```bash
   # Create frontend environment file
   cp .env.example .env
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   # Windows
   venv\Scripts\activate
   # macOS/Linux  
   source venv/bin/activate
   
   python main.py
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Project Structure

```
lensify/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   └── ...
│   └── package.json
├── backend/           # FastAPI backend
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## Development Progress

- [x] Project setup and configuration
- [x] Backend API with image processing
- [x] Redux store configuration
- [x] Multi-file upload component
- [x] Photo basket and thumbnail gallery
- [x] Effect gallery with real-time preview
- [x] Batch processing functionality
- [x] UI styling and polishing
- [x] Complete application interface
- [ ] Testing and optimization
