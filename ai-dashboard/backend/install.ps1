# Installation script for Neural Nexus Backend
# Run this script from PowerShell in the backend directory

Write-Host "Installing Neural Nexus Backend Dependencies..." -ForegroundColor Green

# Upgrade pip first
Write-Host "`nUpgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install packages one by one for better error handling
Write-Host "`nInstalling Flask and Flask-CORS..." -ForegroundColor Yellow
python -m pip install flask flask-cors python-dotenv

Write-Host "`nInstalling NumPy and core dependencies..." -ForegroundColor Yellow
python -m pip install numpy pandas

Write-Host "`nInstalling ML libraries..." -ForegroundColor Yellow
python -m pip install scikit-learn joblib

Write-Host "`nInstalling audio processing libraries..." -ForegroundColor Yellow
python -m pip install librosa soundfile

Write-Host "`nInstalling XGBoost..." -ForegroundColor Yellow
python -m pip install xgboost

Write-Host "`nInstalling OpenCV and Pillow..." -ForegroundColor Yellow
python -m pip install opencv-python Pillow

Write-Host "`nInstalling TensorFlow (this might take a while)..." -ForegroundColor Yellow
python -m pip install tensorflow

Write-Host "`nAll dependencies installed successfully!" -ForegroundColor Green
Write-Host "`nYou can now run the backend with:" -ForegroundColor Cyan
Write-Host "python app.py" -ForegroundColor White
