# Neural Nexus - AI Platform Dashboard

A production-grade AI dashboard that integrates 3 different ML systems into one unified interface.

## Features

### AI Models Integrated

1. **Audio Traffic AI** - Analyze road traffic audio to classify traffic density (Low/Medium/High)
2. **Wine Quality AI** - Predict wine quality scores based on chemical properties
3. **Personality AI** - Analyze text to predict MBTI personality types with recommendations

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- React Hook Form + Zod (form validation)
- ShadCN-inspired UI components

**Backend:**
- Python Flask API
- scikit-learn
- librosa (audio processing)
- RandomForestClassifier/Regressor
- LinearSVC (text classification)

## Getting Started

### Frontend Setup

```bash
cd ai-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate or .\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Export your trained models (modify paths in export_models.py)
python export_models.py

# Run API server
python app.py
```

API will be available at [http://localhost:5000](http://localhost:5000).

## Project Structure

```
ai-dashboard/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard pages
│   │   ├── audio/          # Audio AI module
│   │   ├── numeric/        # Wine Quality module
│   │   ├── text/           # Personality AI module
│   │   ├── history/        # Analysis history
│   │   └── settings/       # Settings page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # UI components (Button, Card, etc.)
│   ├── cards/              # Card components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/
│   ├── api.ts              # API integration
│   └── utils.ts            # Utility functions
├── store/
│   └── useStore.ts         # Zustand state management
├── types/
│   └── index.ts            # TypeScript types
├── backend/
│   ├── app.py              # Flask API server
│   ├── export_models.py    # Model export script
│   ├── models/             # Saved ML models
│   └── requirements.txt    # Python dependencies
└── package.json
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/audio/predict` | POST | Predict traffic level from audio file |
| `/api/numeric/predict` | POST | Predict wine quality from features |
| `/api/text/predict` | POST | Predict MBTI personality from text |
| `/api/health` | GET | Health check |

## Demo Mode

The frontend includes mock API functions for demo purposes. When the backend is not connected, the dashboard uses simulated responses.

To connect to the real backend:
1. Start the Flask API server
2. Ensure `NEXT_PUBLIC_API_URL` in `.env.local` points to your API
3. Replace `mockPredictX` calls with `predictX` in the page components

## License

MIT License
