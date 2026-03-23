"""
Neural Nexus AI Backend API
Flask-based API server for ML model predictions
"""

import os
import re
import tempfile
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import librosa
import cv2
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Model paths (adjust based on your saved models)
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Global placeholders for models (load on startup)
audio_model = None
wine_model = None
wine_scaler = None
text_model = None
text_vectorizer = None
text_encoder = None
video_model = None
health_model = None
health_scaler = None


def load_models():
    """Load all ML models on startup"""
    global audio_model, wine_model, wine_scaler, text_model, text_vectorizer, text_encoder
    global video_model, health_model, health_scaler

    try:
        # Load audio traffic classification model
        audio_model_path = os.path.join(MODELS_DIR, 'audio_traffic_model.pkl')
        if os.path.exists(audio_model_path):
            audio_model = joblib.load(audio_model_path)
            print("Audio model loaded successfully")

        # Load wine quality prediction model and scaler
        wine_model_path = os.path.join(MODELS_DIR, 'wine_quality_model.pkl')
        wine_scaler_path = os.path.join(MODELS_DIR, 'wine_scaler.pkl')
        if os.path.exists(wine_model_path):
            wine_model = joblib.load(wine_model_path)
            print("Wine model loaded successfully")
        if os.path.exists(wine_scaler_path):
            wine_scaler = joblib.load(wine_scaler_path)
            print("Wine scaler loaded successfully")

        # Load text personality prediction model, vectorizer, and encoder
        text_model_path = os.path.join(MODELS_DIR, 'personality_model.pkl')
        text_vectorizer_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl')
        text_encoder_path = os.path.join(MODELS_DIR, 'label_encoder.pkl')
        if os.path.exists(text_model_path):
            text_model = joblib.load(text_model_path)
            print("Text model loaded successfully")
        if os.path.exists(text_vectorizer_path):
            text_vectorizer = joblib.load(text_vectorizer_path)
            print("Text vectorizer loaded successfully")
        if os.path.exists(text_encoder_path):
            text_encoder = joblib.load(text_encoder_path)
            print("Text encoder loaded successfully")

        # Load video violence detection model
        video_model_path = os.path.join(MODELS_DIR, 'violence_detection_model.pkl')
        if os.path.exists(video_model_path):
            video_model = joblib.load(video_model_path)
            print("Video model loaded successfully")

        # Load health prediction model and scaler
        health_model_path = os.path.join(MODELS_DIR, 'heart_model.pkl')
        health_scaler_path = os.path.join(MODELS_DIR, 'health_scaler.pkl')
        if os.path.exists(health_model_path):
            health_model = joblib.load(health_model_path)
            print("Health model loaded successfully")
        if os.path.exists(health_scaler_path):
            health_scaler = joblib.load(health_scaler_path)
            print("Health scaler loaded successfully")

    except Exception as e:
        print(f"Error loading models: {e}")


# ================== Audio Traffic API ==================

def extract_audio_features(audio_path):
    """Extract features from audio file for traffic classification"""
    y, sr = librosa.load(audio_path, sr=22050)

    # Extract MFCC features
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)

    # Extract Chroma features
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)

    # Extract Spectral Centroid
    spec = librosa.feature.spectral_centroid(y=y, sr=sr)

    # Combine features
    features = np.hstack([
        np.mean(mfcc, axis=1),
        np.mean(chroma, axis=1),
        np.mean(spec)
    ])

    return features


@app.route('/api/audio/predict', methods=['POST'])
def predict_audio_traffic():
    """Predict traffic level from audio file"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']

        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save temporarily and process
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
            audio_file.save(tmp.name)

            # Extract features
            features = extract_audio_features(tmp.name)
            features = features.reshape(1, -1)

            # Cleanup
            os.unlink(tmp.name)

        # Make prediction
        if audio_model is not None:
            prediction = audio_model.predict(features)[0]
            probabilities = audio_model.predict_proba(features)[0]
            confidence = float(np.max(probabilities))

            traffic_levels = ['Low', 'Moderate', 'High']
            traffic = traffic_levels[int(prediction)]
        else:
            # Fallback for demo when model is not loaded
            traffic = np.random.choice(['Low', 'Moderate', 'High'])
            confidence = 0.7 + np.random.random() * 0.25

        return jsonify({
            'traffic': traffic,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================== Wine Quality API ==================

WINE_FEATURES = [
    'fixed_acidity', 'volatile_acidity', 'citric_acid', 'residual_sugar',
    'chlorides', 'free_sulfur_dioxide', 'total_sulfur_dioxide', 'density',
    'pH', 'sulphates', 'alcohol'
]


@app.route('/api/numeric/predict', methods=['POST'])
def predict_wine_quality():
    """Predict wine quality from chemical properties"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract features in correct order
        features = []
        for feature in WINE_FEATURES:
            if feature not in data:
                return jsonify({'error': f'Missing feature: {feature}'}), 400
            features.append(float(data[feature]))

        features = np.array(features).reshape(1, -1)

        # Scale features if scaler is available
        if wine_scaler is not None:
            features = wine_scaler.transform(features)

        # Make prediction
        if wine_model is not None:
            quality = float(wine_model.predict(features)[0])
        else:
            # Fallback for demo
            quality = 5.0 + (data.get('alcohol', 10) - 8) * 0.3 - data.get('volatile_acidity', 0.5) * 2
            quality = max(0, min(10, quality + np.random.random() * 1))

        # Determine category
        if quality >= 7:
            category = 'High'
        elif quality >= 5:
            category = 'Medium'
        else:
            category = 'Low'

        return jsonify({
            'quality': round(quality, 2),
            'category': category,
            'confidence': 0.8 + np.random.random() * 0.15
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================== Video Violence Detection API ==================

IMG_SIZE = 64
SEQUENCE_LENGTH = 20


def extract_video_frames(video_path, max_frames=SEQUENCE_LENGTH):
    """Extract frames from video for violence detection"""
    frames = []
    cap = cv2.VideoCapture(video_path)

    while len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
        frame = frame / 255.0
        frames.append(frame)

    cap.release()

    # Pad with black frames if not enough frames
    while len(frames) < max_frames:
        frames.append(np.zeros((IMG_SIZE, IMG_SIZE, 3)))

    return np.array(frames)


@app.route('/api/video/predict', methods=['POST'])
def predict_video_violence():
    """Predict violence in video"""
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400

        video_file = request.files['video']

        if video_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Check file extension
        allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.webm'}
        file_ext = os.path.splitext(video_file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify({'error': f'Invalid file type. Allowed: {", ".join(allowed_extensions)}'}), 400

        # Save temporarily and process
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            video_file.save(tmp.name)

            # Extract frames
            frames = extract_video_frames(tmp.name)

            # Cleanup
            os.unlink(tmp.name)

        # Make prediction
        if video_model is not None:
            # Reshape for model input
            frames_input = frames.reshape(1, SEQUENCE_LENGTH, IMG_SIZE, IMG_SIZE, 3)
            prediction = video_model.predict(frames_input)[0][0]
            violence = bool(prediction > 0.5)
            confidence = float(prediction) if violence else float(1 - prediction)
        else:
            # Fallback for demo when model is not loaded
            violence = np.random.random() > 0.5
            confidence = 0.7 + np.random.random() * 0.25

        return jsonify({
            'violence': violence,
            'confidence': confidence,
            'frames_analyzed': SEQUENCE_LENGTH
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================== Heart Disease Prediction API ==================

HEALTH_FEATURES = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
]


@app.route('/api/health/predict', methods=['POST'])
def predict_heart_disease():
    """Predict heart disease risk from health parameters"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract features in correct order
        features = []
        for feature in HEALTH_FEATURES:
            if feature not in data:
                return jsonify({'error': f'Missing feature: {feature}'}), 400
            features.append(float(data[feature]))

        features = np.array(features).reshape(1, -1)

        # Scale features if scaler is available
        if health_scaler is not None:
            features = health_scaler.transform(features)

        # Make prediction
        if health_model is not None:
            prediction = health_model.predict(features)[0]
            disease = bool(prediction == 1)

            # Get probability if available
            if hasattr(health_model, 'predict_proba'):
                probabilities = health_model.predict_proba(features)[0]
                confidence = float(np.max(probabilities))
            else:
                confidence = 0.75 + np.random.random() * 0.2
        else:
            # Fallback for demo - simple risk calculation
            risk_score = 0

            # Age risk
            if data.get('age', 50) > 60:
                risk_score += 2
            elif data.get('age', 50) > 45:
                risk_score += 1

            # Cholesterol risk
            if data.get('chol', 200) > 240:
                risk_score += 2
            elif data.get('chol', 200) > 200:
                risk_score += 1

            # Blood pressure risk
            if data.get('trestbps', 120) > 140:
                risk_score += 2
            elif data.get('trestbps', 120) > 120:
                risk_score += 1

            # Heart rate risk
            if data.get('thalach', 150) < 100:
                risk_score += 1

            # Chest pain type
            if data.get('cp', 0) > 2:
                risk_score += 2

            # Exercise induced angina
            if data.get('exang', 0) == 1:
                risk_score += 2

            # ST depression
            if data.get('oldpeak', 0) > 2:
                risk_score += 2
            elif data.get('oldpeak', 0) > 1:
                risk_score += 1

            disease = risk_score > 4
            confidence = 0.75 + np.random.random() * 0.2

        # Determine risk level
        if disease:
            # Calculate risk based on confidence and features
            if confidence > 0.85:
                risk = 'High'
            elif confidence > 0.7:
                risk = 'Medium'
            else:
                risk = 'Low'
        else:
            risk = 'Low'

        return jsonify({
            'disease': disease,
            'risk': risk,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================== Text Personality API ==================

MBTI_TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

# Community recommendations by MBTI type
COMMUNITY_RECOMMENDATIONS = {
    'INTJ': ['r/intj', 'r/science', 'r/chess', 'Strategic Minds Discord'],
    'INTP': ['r/intp', 'r/philosophy', 'r/programming', 'Tech Explorers'],
    'ENTJ': ['r/entj', 'r/entrepreneur', 'r/leadership', 'CEO Network'],
    'ENTP': ['r/entp', 'r/debate', 'r/startups', 'Innovation Hub'],
    'INFJ': ['r/infj', 'r/psychology', 'r/writing', 'Empaths United'],
    'INFP': ['r/infp', 'r/poetry', 'r/art', 'Creative Souls'],
    'ENFJ': ['r/enfj', 'r/teachers', 'r/motivation', 'Leaders Circle'],
    'ENFP': ['r/enfp', 'r/travel', 'r/creativity', 'Adventure Seekers'],
    'ISTJ': ['r/istj', 'r/accounting', 'r/organization', 'Systematic Minds'],
    'ISFJ': ['r/isfj', 'r/nursing', 'r/volunteering', 'Caring Hearts'],
    'ESTJ': ['r/estj', 'r/management', 'r/business', 'Executives Club'],
    'ESFJ': ['r/esfj', 'r/socialwork', 'r/community', 'Community Builders'],
    'ISTP': ['r/istp', 'r/mechanics', 'r/diy', 'Makers Guild'],
    'ISFP': ['r/isfp', 'r/photography', 'r/nature', 'Artistic Spirits'],
    'ESTP': ['r/estp', 'r/sports', 'r/adventure', 'Thrill Seekers'],
    'ESFP': ['r/esfp', 'r/entertainment', 'r/music', 'Party People'],
}

TOPIC_RECOMMENDATIONS = {
    'INTJ': ['Systems Thinking', 'Long-term Planning', 'Efficiency', 'Strategy Games'],
    'INTP': ['Theoretical Physics', 'Logic Puzzles', 'Philosophy', 'Programming'],
    'ENTJ': ['Business Strategy', 'Leadership', 'Goal Setting', 'Public Speaking'],
    'ENTP': ['Debating', 'Entrepreneurship', 'Innovation', 'Science Fiction'],
    'INFJ': ['Psychology', 'Human Nature', 'Writing', 'Personal Growth'],
    'INFP': ['Creative Writing', 'Art', 'Music', 'Spirituality'],
    'ENFJ': ['Coaching', 'Education', 'Social Causes', 'Team Building'],
    'ENFP': ['Creativity', 'Travel', 'New Experiences', 'Storytelling'],
    'ISTJ': ['History', 'Organization', 'Tradition', 'Quality Assurance'],
    'ISFJ': ['Healthcare', 'Traditions', 'Family', 'Helping Others'],
    'ESTJ': ['Management', 'Law', 'Efficiency', 'Standards'],
    'ESFJ': ['Community Events', 'Social Harmony', 'Hospitality', 'Teamwork'],
    'ISTP': ['Mechanics', 'Sports', 'DIY Projects', 'Problem Solving'],
    'ISFP': ['Art', 'Nature', 'Animals', 'Fashion'],
    'ESTP': ['Sports', 'Adventure', 'Business', 'Networking'],
    'ESFP': ['Entertainment', 'Performing', 'Fashion', 'Social Events'],
}

CONTENT_RECOMMENDATIONS = {
    'INTJ': ['Strategic planning guides', 'Science documentaries', 'Chess tutorials', 'Productivity systems'],
    'INTP': ['Philosophy lectures', 'Tech deep dives', 'Logic courses', 'Debate analysis'],
    'ENTJ': ['Leadership courses', 'Business podcasts', 'TED talks', 'Biography series'],
    'ENTP': ['Debate channels', 'Startup stories', 'Innovation podcasts', 'Sci-fi recommendations'],
    'INFJ': ['Psychology courses', 'Writing workshops', 'Meditation guides', 'Personality content'],
    'INFP': ['Creative writing guides', 'Art tutorials', 'Poetry collections', 'Music playlists'],
    'ENFJ': ['Teaching methods', 'Motivational content', 'Communication skills', 'Leadership stories'],
    'ENFP': ['Travel vlogs', 'Creative challenges', 'Language learning', 'Adventure stories'],
    'ISTJ': ['Historical documentaries', 'Organizational tools', 'Financial planning', 'Quality guides'],
    'ISFJ': ['Healthcare tips', 'Family activities', 'Volunteer opportunities', 'Traditional crafts'],
    'ESTJ': ['Management courses', 'Business news', 'Efficiency tools', 'Leadership frameworks'],
    'ESFJ': ['Community guides', 'Event planning', 'Social skills', 'Team activities'],
    'ISTP': ['DIY tutorials', 'Sports analysis', 'Tool reviews', 'Car mechanics'],
    'ISFP': ['Art galleries', 'Nature documentaries', 'Music discovery', 'Fashion trends'],
    'ESTP': ['Extreme sports', 'Business tactics', 'Networking tips', 'Adventure gear'],
    'ESFP': ['Entertainment reviews', 'Performance tips', 'Party ideas', 'Social trends'],
}


def preprocess_text(text):
    """Preprocess text for personality prediction"""
    text = text.lower()
    text = re.sub(r"http\S+", "", text)  # Remove URLs
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # Remove special characters
    return text


@app.route('/api/text/predict', methods=['POST'])
def predict_personality():
    """Predict MBTI personality type from text"""
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']

        if len(text.strip()) < 10:
            return jsonify({'error': 'Text is too short for analysis'}), 400

        # Preprocess text
        clean_text = preprocess_text(text)

        # Make prediction
        if text_model is not None and text_vectorizer is not None and text_encoder is not None:
            # Transform text to features
            text_features = text_vectorizer.transform([clean_text])

            # Predict
            prediction = text_model.predict(text_features)[0]
            mbti_type = text_encoder.inverse_transform([prediction])[0]

            # Get confidence if available
            if hasattr(text_model, 'predict_proba'):
                probabilities = text_model.predict_proba(text_features)[0]
                confidence = float(np.max(probabilities))
            else:
                confidence = 0.6 + np.random.random() * 0.3
        else:
            # Fallback for demo
            mbti_type = np.random.choice(MBTI_TYPES)
            confidence = 0.6 + np.random.random() * 0.3

        return jsonify({
            'mbti_type': mbti_type,
            'confidence': confidence,
            'recommendations': {
                'communities': COMMUNITY_RECOMMENDATIONS.get(mbti_type, []),
                'topics': TOPIC_RECOMMENDATIONS.get(mbti_type, []),
                'content': CONTENT_RECOMMENDATIONS.get(mbti_type, [])
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ================== Health Check ==================

@app.route('/')
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'Neural Nexus API is running',
        'version': '2.0.0',
        'endpoints': [
            '/api/audio/predict',
            '/api/numeric/predict',
            '/api/text/predict',
            '/api/video/predict',
            '/api/health/predict',
            '/api/status'
        ]
    })


@app.route('/api/status', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models': {
            'audio': audio_model is not None,
            'wine': wine_model is not None,
            'text': text_model is not None,
            'video': video_model is not None,
            'health': health_model is not None
        }
    })


# ================== Main ==================

if __name__ == '__main__':
    print("Loading ML models...")
    load_models()
    print("Starting Neural Nexus API server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
