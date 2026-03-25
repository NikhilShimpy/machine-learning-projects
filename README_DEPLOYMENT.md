# Neural Nexus AI Platform - Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Recommended Architecture](#recommended-architecture)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Local Development Setup](#local-development-setup)
6. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
7. [Backend Deployment (Render/Railway)](#backend-deployment-renderrailway)
8. [Environment Variables](#environment-variables)
9. [Production Build & Testing](#production-build--testing)
10. [Troubleshooting](#troubleshooting)
11. [Common Deployment Errors](#common-deployment-errors)
12. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🎯 Project Overview

**Neural Nexus** is an AI-powered platform that provides multiple machine learning prediction services:

| Service | Description | Technology |
|---------|-------------|------------|
| **Audio Traffic AI** | Classifies road traffic density from audio | Random Forest + Librosa |
| **Personality AI** | Predicts MBTI type from text | SVM + TF-IDF |
| **Video Violence AI** | Detects violence in videos | CNN + LSTM |
| **Heart Disease AI** | Predicts heart disease risk | Random Forest Regressor |
| **Brain Tumor MRI AI** | Classifies brain tumors from MRI scans | Transfer Learning (MobileNetV2/ResNet50) |

**Tech Stack**:
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Flask, Python 3.11, scikit-learn, librosa, opencv
- **Models**: Random Forest, SVM, CNN+LSTM, Transfer Learning

---

## 🏗️ Recommended Architecture

### **SEPARATE DEPLOYMENTS** (Production-Safe)

```
┌─────────────────────────────────────────┐
│         USER'S BROWSER                  │
│   (https://your-app.vercel.app)        │
└───────────────┬─────────────────────────┘
                │
                │ HTTPS Requests
                │
                ▼
┌─────────────────────────────────────────┐
│      VERCEL (Frontend Only)             │
│                                         │
│  • Next.js Application                  │
│  • Static Pages + Client-Side Logic     │
│  • Environment: NEXT_PUBLIC_API_URL     │
└───────────────┬─────────────────────────┘
                │
                │ API Calls
                │ (Cross-Origin)
                ▼
┌─────────────────────────────────────────┐
│   RENDER/RAILWAY (Backend Only)         │
│                                         │
│  • Flask API Server                     │
│  • ML Models (.pkl files)               │
│  • Python Dependencies (736MB+)         │
│  • CORS Enabled for Frontend            │
└─────────────────────────────────────────┘
```

### Why This Architecture?

✅ **Pros**:
- Vercel is optimized for Next.js (frontend)
- Render/Railway supports Python + large dependencies
- Independent scaling and deployment
- No serverless size/time limits for ML models
- Free tiers available on both platforms

❌ **Why NOT Vercel Serverless Functions for Backend?**:
- 50MB deployment size limit (your ML deps are 736MB+)
- 10s execution timeout on hobby plan (video processing takes longer)
- Python serverless functions are experimental
- Model files can't be included in deployment

---

## 📁 Project Structure

```
machine-learning-projects/
├── ai-dashboard/                    # Main application folder
│   ├── app/                         # Next.js 14 App Router (frontend)
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── audio/              # Audio traffic page
│   │   │   ├── text/               # Personality prediction page
│   │   │   ├── video/              # Violence detection page
│   │   │   ├── health/             # Heart disease page
│   │   │   └── image/              # Brain tumor MRI page
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   │
│   ├── backend/                     # Flask backend (API server)
│   │   ├── models/                 # ML model files (.pkl)
│   │   ├── utils/                  # Utility functions
│   │   ├── app.py                  # Main Flask app
│   │   ├── requirements.txt        # Python dependencies
│   │   ├── Procfile                # Deployment config (Render/Railway)
│   │   ├── runtime.txt             # Python version
│   │   └── .env.example            # Backend env template
│   │
│   ├── components/                  # React components
│   ├── lib/                        # API client & utilities
│   ├── store/                      # Zustand state management
│   ├── types/                      # TypeScript types
│   ├── .env.example                # Frontend env template
│   ├── .env.local                  # Frontend env (local, gitignored)
│   ├── next.config.mjs             # Next.js configuration
│   ├── package.json                # Node dependencies
│   └── tailwind.config.ts          # Tailwind CSS config
│
├── model-readmes/                   # Model documentation
│   ├── audio-traffic-ai.md
│   ├── personality-ai.md
│   ├── video-violence-ai.md
│   ├── heart-disease-ai.md
│   └── brain-tumor-mri-ai.md
│
├── *.ipynb                          # Jupyter notebooks (training)
├── README_DEPLOYMENT.md             # This file
└── vercel.json                      # Vercel configuration
```

---

## ✅ Prerequisites

### Required Accounts:
1. **GitHub Account**: For hosting code repository
2. **Vercel Account**: For frontend deployment (free tier)
3. **Render or Railway Account**: For backend deployment (free tier)

### Required Software (Local Development):
- **Node.js** ≥ 18.0.0 ([Download](https://nodejs.org/))
- **Python** 3.11.x ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional:
- **VS Code** or any code editor
- **Postman** or **Insomnia** for API testing

---

## 🛠️ Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd machine-learning-projects
```

### Step 2: Setup Frontend (Next.js)

```bash
# Navigate to frontend folder
cd ai-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local (use your text editor)
# Set: NEXT_PUBLIC_API_URL=http://127.0.0.1:5000

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

### Step 3: Setup Backend (Flask)

**Open a new terminal window:**

```bash
# Navigate to backend folder
cd ai-dashboard/backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Create virtual environment (Mac/Linux)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# (Optional) Edit .env if needed

# Start Flask server
python app.py
```

Backend will run on: **http://127.0.0.1:5000**

### Step 4: Test Locally

1. Open browser: **http://localhost:3000**
2. Navigate to any AI service (e.g., Audio Traffic AI)
3. Upload a test file
4. Verify prediction works

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub

```bash
# From project root directory
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. **Go to**: [https://vercel.com](https://vercel.com)
2. **Sign in** with GitHub
3. Click **"Add New Project"**
4. Click **"Import"** next to your repository
5. **Configure Project**:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Next.js |
   | **Root Directory** | `ai-dashboard` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `.next` (auto-detected) |
   | **Install Command** | `npm install` |

6. **Environment Variables**:
   - Click **"Environment Variables"**
   - Add: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.onrender.com` (placeholder for now)
   - Click **"Add"**

7. Click **"Deploy"**

### Step 3: Wait for Deployment

- Vercel will build and deploy (2-5 minutes)
- Watch build logs for any errors
- You'll get a URL like: `https://your-app.vercel.app`

### Step 4: Update Environment Variable (After Backend is Deployed)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Edit `NEXT_PUBLIC_API_URL`
4. Update value to your actual backend URL
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"Redeploy"** on latest deployment

**Important**: Environment variables only take effect after redeployment!

---

## 🐍 Backend Deployment (Render/Railway)

### Option A: Deploy to Render (Recommended)

#### Step 1: Prepare Backend for Deployment

Ensure these files exist in `ai-dashboard/backend/`:
- ✅ `app.py` (Flask app)
- ✅ `requirements.txt` (Python dependencies)
- ✅ `Procfile` (should contain: `web: gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120 --workers 2`)
- ✅ `runtime.txt` (should contain: `python-3.11.0`)

#### Step 2: Create Render Account

1. Go to: [https://render.com](https://render.com)
2. Sign up with GitHub

#### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** to link GitHub
3. Select your repository
4. Click **"Connect"**

#### Step 4: Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `neural-nexus-backend` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `ai-dashboard/backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120 --workers 2` |
| **Instance Type** | `Free` (or paid for better performance) |

#### Step 5: Environment Variables (Render)

Add these in the "Environment Variables" section:
- `PYTHON_VERSION`: `3.11.0`
- `FLASK_ENV`: `production`
- `CORS_ORIGINS`: `https://your-app.vercel.app` (update after frontend is deployed)

#### Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for build (10-15 minutes first time)
3. Watch logs for errors
4. Once "Live", copy the service URL (e.g., `https://neural-nexus-backend.onrender.com`)

#### Step 7: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your Render URL
4. Redeploy frontend

---

### Option B: Deploy to Railway (Alternative)

#### Step 1: Create Railway Account

1. Go to: [https://railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Click **"Deploy Now"**

#### Step 3: Configure Root Directory

1. Click on your service
2. Go to **"Settings"**
3. Under **"Root Directory"**, set: `ai-dashboard/backend`
4. Click **"Update"**

#### Step 4: Environment Variables (Railway)

1. Go to **"Variables"** tab
2. Click **"New Variable"**
3. Add:
   - `PYTHON_VERSION`: `3.11.0`
   - `FLASK_ENV`: `production`
   - `PORT`: `5000` (Railway auto-sets this, but explicit is good)
   - `CORS_ORIGINS`: `https://your-app.vercel.app`

#### Step 5: Generate Domain

1. Go to **"Settings"** tab
2. Under **"Environment"** → **"Public Networking"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://your-backend.up.railway.app`)

#### Step 6: Update Frontend

1. Go to Vercel
2. Update `NEXT_PUBLIC_API_URL` with Railway URL
3. Redeploy

---

## 🔐 Environment Variables

### Frontend (.env.local or Vercel)

```bash
# Required
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Optional (for development only)
# NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

### Backend (.env or Render/Railway)

```bash
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# Server
HOST=0.0.0.0
PORT=5000

# CORS (Important!)
# Add your Vercel frontend URL here
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000

# Models
MODELS_DIR=./models
```

**Security Note**: Never commit `.env` or `.env.local` to GitHub!

---

## 🧪 Production Build & Testing

### Test Frontend Build Locally

```bash
cd ai-dashboard

# Build for production
npm run build

# Start production server
npm start

# Open: http://localhost:3000
```

**Check for**:
- No build errors
- No console errors in browser
- All pages load correctly
- Environment variables are accessible

### Test Backend Locally (Production Mode)

```bash
cd ai-dashboard/backend

# Activate venv
source venv/bin/activate  # Mac/Linux
# or
venv\Scripts\activate     # Windows

# Set production environment
export FLASK_ENV=production  # Mac/Linux
set FLASK_ENV=production     # Windows

# Run with gunicorn (production server)
gunicorn app:app --bind 0.0.0.0:5000 --timeout 120 --workers 2

# Open: http://localhost:5000
# Should see: {"message": "Neural Nexus API is running", ...}
```

### Test API Endpoints

Use Postman/Insomnia or curl:

```bash
# Health check
curl http://localhost:5000/api/status

# Test audio prediction (replace with actual file)
curl -X POST http://localhost:5000/api/audio/predict \
  -F "audio=@test_audio.wav"

# Test text prediction
curl -X POST http://localhost:5000/api/text/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I love solving complex problems and thinking strategically."}'
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms**: CORS errors, network errors, API calls failing

**Solutions**:
1. **Check CORS settings** in `backend/app.py`:
   ```python
   CORS(app, resources={r"/api/*": {"origins": "*"}})
   ```
2. **Verify environment variable**:
   - Frontend `NEXT_PUBLIC_API_URL` matches backend URL
   - No trailing slash in URL
3. **Check backend is running**:
   - Visit `https://your-backend-url.onrender.com` directly
   - Should see: `{"message": "Neural Nexus API is running"}`
4. **Update CORS_ORIGINS**:
   - In backend env vars, add your Vercel URL
   - Redeploy backend

---

### Issue: Backend out of memory or timeout

**Symptoms**: 502 Bad Gateway, timeout errors, loading forever

**Solutions**:
1. **Increase timeout** in `Procfile`:
   ```
   web: gunicorn app:app --bind 0.0.0.0:$PORT --timeout 180 --workers 2
   ```
2. **Upgrade Render/Railway plan** (free tier has limits)
3. **Reduce model size**:
   - Use smaller models
   - Compress .pkl files
   - Remove unused models
4. **Optimize code**:
   - Lazy load models (only when endpoint is called)
   - Add caching
   - Use smaller batch sizes

---

### Issue: Models not loading

**Symptoms**: 500 error, "model not found", predictions return errors

**Solutions**:
1. **Check model files exist**:
   - Ensure `.pkl` files are in `backend/models/` folder
   - **Note**: Model files are gitignored by default
2. **Train and export models**:
   ```bash
   # In backend folder
   python export_models.py
   ```
3. **Add models to deployment**:
   - Either remove `*.pkl` from `.gitignore` (not recommended if large)
   - Or upload models directly to Render/Railway file system
   - Or use cloud storage (S3, Google Cloud Storage)
4. **Check model paths** in `app.py`:
   ```python
   MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
   ```

---

### Issue: Build fails on Vercel

**Symptoms**: "Build error", "Command failed", red X on deployment

**Solutions**:
1. **Check build logs** in Vercel dashboard
2. **Common issues**:
   - **Missing dependencies**: Run `npm install` locally first
   - **TypeScript errors**: Fix errors shown in logs
   - **Environment variable missing**: Add `NEXT_PUBLIC_API_URL`
   - **Wrong root directory**: Should be `ai-dashboard`
3. **Test build locally**:
   ```bash
   cd ai-dashboard
   npm run build
   ```
4. **Check Node version**:
   - Vercel uses Node 18+ by default
   - Match your local version

---

### Issue: Python dependencies fail to install

**Symptoms**: "pip install failed", "No matching distribution", build error

**Solutions**:
1. **Check Python version**:
   - `runtime.txt` should specify supported version (3.11.0)
2. **Check requirements.txt**:
   - No version conflicts
   - All packages available on PyPI
3. **Remove problematic packages**:
   - `opencv-python` → use `opencv-python-headless` (already done)
   - TensorFlow removed (not compatible with Python 3.14)
4. **Use constraints file** (if needed):
   ```bash
   pip install -r requirements.txt --no-cache-dir
   ```

---

### Issue: CORS errors in browser console

**Symptoms**: "Access-Control-Allow-Origin" error, blocked by CORS policy

**Solutions**:
1. **Update backend CORS settings** (`backend/app.py`):
   ```python
   from flask_cors import CORS
   CORS(app, resources={r"/api/*": {"origins": "*"}})
   # Or specify exact origins:
   # CORS(app, resources={r"/api/*": {"origins": ["https://your-app.vercel.app"]}})
   ```
2. **Check request headers**:
   - Frontend should NOT send `Origin: *`
   - Let browser handle origin automatically
3. **Verify backend deployed**:
   - Backend must be accessible at the URL
   - Test with curl first

---

### Issue: Vercel domain not working

**Symptoms**: "This deployment does not exist", 404, site not found

**Solutions**:
1. **Check deployment status**:
   - Go to Vercel dashboard → Deployments
   - Ensure latest deployment is "Ready"
2. **Wait for DNS propagation** (if custom domain):
   - Can take 24-48 hours
3. **Check domain settings**:
   - Domains tab in Vercel
   - Ensure DNS records are correct

---

## ⚠️ Common Deployment Errors

### Error: "Module not found: Can't resolve '@/...'"

**Cause**: TypeScript path alias not resolving

**Solution**: Check `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### Error: "gunicorn: command not found"

**Cause**: gunicorn not installed

**Solution**: Add to `requirements.txt`:
```
gunicorn>=21.2.0
```

---

### Error: "Application failed to start"

**Cause**: Wrong start command or app entry point

**Solution**: Check `Procfile`:
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```
Ensure `app.py` has:
```python
if __name__ == '__main__':
    app.run(...)
```

---

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Cause**: Backend not running or wrong URL

**Solution**:
1. Verify backend is deployed and running
2. Check `NEXT_PUBLIC_API_URL` in Vercel env vars
3. Test backend URL directly in browser

---

### Error: Video/Audio upload fails

**Cause**: File size limit, timeout, or CORS

**Solution**:
1. **Check file size limits**:
   - Vercel has 4.5MB body size limit (but frontend is only UI)
   - Backend should handle large files
2. **Increase timeout**:
   - In `app.py`: Set longer timeout for video routes
   - In `Procfile`: `--timeout 180`
3. **Check CORS for multipart**:
   - Should already work with `CORS(app, ...)`

---

## ✅ Post-Deployment Checklist

### After Deploying Frontend (Vercel):
- [ ] Deployment shows "Ready" status
- [ ] Frontend URL is accessible
- [ ] Landing page loads correctly
- [ ] No console errors in browser DevTools
- [ ] All navigation links work
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set correctly

### After Deploying Backend (Render/Railway):
- [ ] Service shows "Live" status
- [ ] Backend URL returns API info: `/`
- [ ] Health check works: `/api/status`
- [ ] CORS headers allow frontend domain
- [ ] All API endpoints respond (test with Postman)
- [ ] Models load successfully (check logs)

### Integration Testing:
- [ ] Frontend can call backend API
- [ ] Test each AI service:
  - [ ] Audio Traffic AI (upload .wav file)
  - [ ] Personality AI (enter text)
  - [ ] Video Violence AI (upload video)
  - [ ] Heart Disease AI (enter health data)
  - [ ] Brain Tumor MRI AI (upload MRI image)
- [ ] Results display correctly
- [ ] History feature works (if implemented)
- [ ] Toast notifications appear
- [ ] Loading states work

### Performance:
- [ ] Frontend loads in < 3 seconds
- [ ] API responses < 5 seconds (except video)
- [ ] No memory leaks
- [ ] No console warnings

### Security:
- [ ] No `.env` files committed to GitHub
- [ ] CORS restricted to your domains (or `*` for public API)
- [ ] No API keys exposed in frontend
- [ ] HTTPS enabled (automatic on Vercel/Render)

### Documentation:
- [ ] README.md is up to date
- [ ] Model documentation in `model-readmes/` is complete
- [ ] Deployment guide (this file) is accurate
- [ ] Environment variables documented

---

## 🔗 Helpful Links

### Documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)

### Tutorials:
- [Deploy Next.js to Vercel](https://vercel.com/guides/deploying-nextjs-with-vercel)
- [Deploy Flask to Render](https://render.com/docs/deploy-flask)
- [CORS in Flask](https://flask-cors.readthedocs.io/)

### Troubleshooting:
- [Vercel Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot)
- [Render Troubleshooting](https://render.com/docs/troubleshooting)

---

## 📞 Need Help?

If you encounter issues:
1. **Check logs**:
   - Vercel: Dashboard → Deployments → Click deployment → View logs
   - Render: Dashboard → Service → Logs tab
2. **Test locally first**: Ensure everything works locally before deploying
3. **Review this guide**: Most issues are covered in Troubleshooting section
4. **Check GitHub Issues**: See if others faced similar issues
5. **Community support**: Vercel/Render/Railway have Discord communities

---

## 🎉 Congratulations!

If you've successfully deployed both frontend and backend:
- ✅ Your AI platform is now LIVE on the internet
- ✅ Users can access it from anywhere
- ✅ All 5 AI models are functional
- ✅ You have a production-ready ML application

**Share your app**: `https://your-app.vercel.app`

---

## 📝 Next Steps (Optional)

### Custom Domain:
1. **Buy a domain** (Namecheap, Google Domains)
2. **Add to Vercel**:
   - Dashboard → Settings → Domains
   - Add your domain
   - Follow DNS instructions
3. **Update backend CORS**: Add custom domain to `CORS_ORIGINS`

### Monitoring:
- **Vercel Analytics**: Enable in dashboard
- **Backend Monitoring**: Render has built-in logs
- **Error Tracking**: Add Sentry (optional)

### Scaling:
- **Upgrade plans**: Switch to paid plans for better performance
- **Add caching**: Redis for API responses
- **CDN**: Vercel includes CDN automatically
- **Database**: Add PostgreSQL for user data (if needed)

### CI/CD:
- **Already set up!**: Push to GitHub → Auto-deploys to Vercel/Render
- **Branches**: You can deploy `dev` branch to staging environment

---

**Last Updated**: 2026-03-26
**Author**: Claude (AI Assistant)
**Project**: Neural Nexus AI Platform
