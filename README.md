# Lensify - Instant Photo Effects

A web application that allows users to apply high-quality, artistic camera effects to their photos with batch processing support.

## Features

- Upload multiple photos at once
- Apply effects to individual photos or entire batches
- Real-time preview of effects
- Download processed images as individual files or ZIP archive
- 8 predefined effects: Vintage, Black & White, Cinematic, Lomo, Warm, Cool, Sharp, Soft

## Tech Stack

### Frontend
- React + TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- FastAPI (Python)
- Pillow for image processing
- NumPy for advanced effects

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd lensify
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server
```bash
cd backend
python main.py
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open http://localhost:5173 in your browser

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
- [ ] Multi-file upload component
- [ ] Photo basket and thumbnail gallery
- [ ] Effect gallery with real-time preview
- [ ] Batch processing functionality
- [ ] UI styling and polishing
- [ ] Testing and optimization
