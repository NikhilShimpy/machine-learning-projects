"""
Model Export Script
Run this script to export trained models for the API
"""

import joblib
import pandas as pd
import numpy as np
import re
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.svm import LinearSVC

# Create models directory
os.makedirs('models', exist_ok=True)


def train_and_export_wine_model(csv_path='winequality-red.csv'):
    """Train and export wine quality prediction model"""
    print("Training wine quality model...")

    # Load data
    df = pd.read_csv(csv_path)
    df = df.drop_duplicates()

    # Prepare features and target
    X = df.drop(columns=["quality"])
    y = df["quality"]

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train model
    model = RandomForestRegressor(
        n_estimators=800,
        max_depth=25,
        min_samples_split=4,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=42
    )
    model.fit(X_scaled, y)

    # Export
    joblib.dump(model, 'models/wine_quality_model.pkl')
    joblib.dump(scaler, 'models/wine_scaler.pkl')

    print("Wine model exported successfully!")
    return model, scaler


def train_and_export_audio_model(audio_dir='Audio'):
    """Train and export audio traffic classification model"""
    print("Training audio traffic model...")

    import librosa

    def extract_features(audio_path):
        y, sr = librosa.load(audio_path, sr=22050)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        spec = librosa.feature.spectral_centroid(y=y, sr=sr)
        return np.hstack([np.mean(mfcc, axis=1), np.mean(chroma, axis=1), np.mean(spec)])

    def augment_audio(y, sr):
        noise = np.random.randn(len(y))
        y_noise = y + 0.005 * noise
        y_shift = np.roll(y, int(sr * 0.2))
        return [y, y_noise, y_shift]

    X, y = [], []

    for file in os.listdir(audio_dir):
        if not file.endswith('.wav'):
            continue

        path = os.path.join(audio_dir, file)

        if "Low" in file:
            label = 0
        elif "Moderate" in file:
            label = 1
        elif "High" in file:
            label = 2
        else:
            continue

        y_audio, sr = librosa.load(path, sr=22050)

        for aug in augment_audio(y_audio, sr):
            features = extract_features(path)
            X.append(features)
            y.append(label)

    X = np.array(X)
    y = np.array(y)

    # Train model
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X, y)

    # Export
    joblib.dump(model, 'models/audio_traffic_model.pkl')

    print("Audio model exported successfully!")
    return model


def train_and_export_text_model(csv_path='mbti_1.csv'):
    """Train and export personality prediction model"""
    print("Training personality model...")

    # Load data
    df = pd.read_csv(csv_path, engine="python", on_bad_lines="skip")

    # Preprocess
    def preprocess_text(text):
        text = text.lower()
        text = re.sub(r"http\S+", "", text)
        text = re.sub(r"[^a-zA-Z\s]", "", text)
        return text

    df["clean_posts"] = df["posts"].apply(preprocess_text)

    # Vectorize
    vectorizer = TfidfVectorizer(max_features=10000, stop_words="english")
    X = vectorizer.fit_transform(df["clean_posts"])

    # Encode labels
    encoder = LabelEncoder()
    y = encoder.fit_transform(df["type"])

    # Train model (LinearSVC has best accuracy from notebook)
    model = LinearSVC(C=1.0)
    model.fit(X, y)

    # Export
    joblib.dump(model, 'models/personality_model.pkl')
    joblib.dump(vectorizer, 'models/tfidf_vectorizer.pkl')
    joblib.dump(encoder, 'models/label_encoder.pkl')

    print("Personality model exported successfully!")
    return model, vectorizer, encoder


if __name__ == '__main__':
    print("=" * 50)
    print("Neural Nexus Model Export Script")
    print("=" * 50)

    # Uncomment the models you want to train and export
    # Make sure you have the required datasets in the current directory

    # train_and_export_wine_model('winequality-red.csv')
    # train_and_export_audio_model('Audio')
    # train_and_export_text_model('mbti_1.csv')

    print("\nDone! Models are saved in the 'models' directory.")
    print("Copy them to your API server to enable predictions.")
