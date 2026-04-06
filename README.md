# Neural Nexus AI Platform

**Multi-Modal Machine Learning Project for Real-World Applications**

A comprehensive AI platform featuring five machine learning models for audio classification, wine quality prediction, personality analysis, violence detection, and brain tumor MRI classification.

---

## Contributors

- Chetna Sikarwar (@chetnasingh31)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Audio Traffic AI](#1-audio-traffic-ai)
3. [Numeric AI - Wine Quality](#2-numeric-ai---wine-quality-prediction)
4. [Text AI - Personality Prediction](#3-text-ai---personality-prediction-mbti)
5. [Video AI - Violence Detection](#4-video-ai---violence-detection)
6. [Image AI - Brain Tumor MRI Classification](#5-image-ai---brain-tumor-mri-classification)
7. [Technology Stack](#technology-stack)
8. [How to Run](#how-to-run)
9. [Viva Preparation](#viva-preparation)

---

## Project Overview

This project demonstrates the application of machine learning and deep learning techniques across multiple data modalities:

| Model | Data Type | Algorithm | Accuracy |
|-------|-----------|-----------|----------|
| Audio Traffic AI | Audio (.wav) | Random Forest | 67% |
| Wine Quality AI | Numeric (tabular) | Random Forest Regressor | R² = 46.39% |
| Personality AI | Text | Linear SVC | 63.29% |
| Video Violence AI | Video (frames) | CNN + LSTM | 66.67% |
| Brain Tumor MRI AI | Image (MRI) | MobileNetV2 | 77% |

---

## 1. Audio Traffic AI

### Purpose
Classify road traffic density from audio recordings into three categories: **Low**, **Moderate**, and **High** traffic.

### Dataset
- **Source**: [Kaggle - Road Traffic Audio](https://www.kaggle.com/datasets/nilshmeier/road-traffic-audio)
- **Size**: ~309 MB
- **Files**: 9 labeled audio files (3 per class: Low_01-03, Moderate_01-03, High_01-03)
- **Total Samples**: 27 (after data augmentation)
- **Format**: WAV files

### Input / Output
- **Input**: Audio file (.wav) of road traffic
- **Output**: Traffic density class (Low / Moderate / High)

### Feature Extraction
| Feature Type | Count |
|--------------|-------|
| MFCC (Mel-Frequency Cepstral Coefficients) | 20 |
| Chroma STFT | 12 |
| Spectral Centroid | 1 |
| **Total Features** | **33** |

### Data Augmentation
- Noise addition (Gaussian noise with factor 0.005)
- Time shifting (200ms shift)

### Algorithms Tested
| Algorithm | Configuration | Result |
|-----------|---------------|--------|
| **Random Forest Classifier** | n_estimators=200 | **Selected** |

### Final Model Performance
| Metric | Value |
|--------|-------|
| **Test Accuracy** | **67%** |
| **Cross-Validation Accuracy (3-fold)** | **74.07%** |
| Macro Avg Precision | 0.67 |
| Macro Avg Recall | 0.67 |
| Macro Avg F1-Score | 0.66 |

### Classification Report
```
              precision    recall  f1-score   support
           0       0.50      0.67      0.57         3
           1       0.50      0.33      0.40         3
           2       1.00      1.00      1.00         3
    accuracy                           0.67         9
```

### Why Random Forest Was Selected
- Handles small datasets effectively
- Works well with extracted audio features
- No need for extensive hyperparameter tuning
- Robust to overfitting with ensemble approach

### Real-World Applications
- Smart city traffic monitoring
- Autonomous vehicle audio sensing
- Urban planning and traffic management
- Environmental noise level assessment

### Limitations
- Small dataset (only 9 original labeled samples)
- Limited to specific recording conditions
- May not generalize to different environments or microphones
- Requires consistent audio quality

### Future Work
- Collect larger, more diverse dataset
- Implement CNN-based spectrogram classification
- Add real-time audio streaming support
- Include more traffic density levels

---

## 2. Numeric AI - Wine Quality Prediction

### Purpose
Predict the quality score (0-10) of red wine based on its chemical properties using regression analysis.

### Dataset
- **Source**: [UCI Red Wine Quality Dataset](https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009)
- **Samples**: 1,599 wine samples (after duplicate removal)
- **Target**: Quality score (integer 0-10)

### Input / Output
- **Input**: 11 chemical properties of wine
- **Output**: Predicted quality score (0-10) + Category (Low/Medium/High)

### Features (11 Input Variables)
| Feature | Description |
|---------|-------------|
| fixed_acidity | Tartaric acid concentration |
| volatile_acidity | Acetic acid concentration |
| citric_acid | Freshness indicator |
| residual_sugar | Remaining sugar after fermentation |
| chlorides | Salt content |
| free_sulfur_dioxide | Free SO2 preventing microbial growth |
| total_sulfur_dioxide | Total SO2 content |
| density | Mass/volume ratio |
| pH | Acidity level |
| sulphates | Wine additive (antimicrobial) |
| alcohol | Alcohol percentage |

### Preprocessing
- Duplicate removal
- StandardScaler normalization
- Train-test split: 80/20

### Algorithms Tested
| Algorithm | Configuration | R² Score |
|-----------|---------------|----------|
| **Random Forest Regressor** | n_estimators=800, max_depth=25 | **0.4639** |
| Gradient Boosting Regressor | n_estimators=1000, learning_rate=0.01 | Tested |
| XGBoost Regressor | n_estimators=800, learning_rate=0.03 | Tested |

### Final Model Configuration
```python
RandomForestRegressor(
    n_estimators=800,
    max_depth=25,
    min_samples_split=4,
    min_samples_leaf=2,
    max_features='sqrt',
    random_state=42
)
```

### Final Model Performance
| Metric | Value |
|--------|-------|
| **R² Score** | **46.39%** |
| MSE | 0.3798 |
| RMSE | 0.6163 |

### Why Random Forest Regressor Was Selected
- Highest R² score among tested models
- Handles non-linear relationships
- Resistant to overfitting
- Feature importance interpretability

### Real-World Applications
- Wine industry quality control
- Automated wine grading systems
- Vineyard production optimization
- Consumer recommendation systems

### Limitations
- R² score indicates moderate predictive power
- Quality is subjective (human tasters vary)
- Dataset limited to red Portuguese "Vinho Verde" wine
- Doesn't account for taste preferences

### Future Work
- Include white wine samples
- Add more chemical features
- Implement classification approach (Low/Medium/High)
- Ensemble with neural networks

---

## 3. Text AI - Personality Prediction (MBTI)

### Purpose
Predict MBTI personality type from text input and provide personalized content/community recommendations.

### Dataset
- **Source**: [Kaggle MBTI Dataset](https://www.kaggle.com/datasets/datasnaek/mbti-type)
- **Samples**: 8,675 users
- **Target**: 16 MBTI personality types

### Input / Output
- **Input**: User-written text (posts, essays, social media content)
- **Output**: MBTI type (e.g., INTJ, ENFP) + Confidence score + Recommendations

### MBTI Types (16 Classes)
| Category | Types |
|----------|-------|
| Analysts | INTJ, INTP, ENTJ, ENTP |
| Diplomats | INFJ, INFP, ENFJ, ENFP |
| Sentinels | ISTJ, ISFJ, ESTJ, ESFJ |
| Explorers | ISTP, ISFP, ESTP, ESFP |

### Preprocessing
```python
def preprocess_text(text):
    text = text.lower()                        # Lowercase
    text = re.sub(r"http\S+", "", text)       # Remove URLs
    text = re.sub(r"[^a-zA-Z\s]", "", text)   # Remove special chars
    return text
```

### Feature Extraction
- **Method**: TF-IDF Vectorization
- **Max Features**: 10,000
- **Stop Words**: English removed

### Algorithms Tested
| Algorithm | Accuracy |
|-----------|----------|
| **Linear SVC** | **63.29%** |
| Ridge Classifier | 63.11% |
| SGD Classifier | 63.00% |
| Logistic Regression | 62.71% |
| Random Forest | 53.03% |
| Extra Trees | 50.09% |
| Naive Bayes | 30.37% |
| XGBoost | (Interrupted - too slow) |

### Final Model Performance
| Metric | Value |
|--------|-------|
| **Test Accuracy** | **63.29%** |
| Algorithm | Linear SVC |
| Feature Method | TF-IDF (10,000 features) |

### Why Linear SVC Was Selected
- Highest accuracy among all tested models
- Fast training on high-dimensional sparse data
- Effective for text classification
- Linear decision boundary works well with TF-IDF

### Real-World Applications
- Social media personality insights
- Content recommendation engines
- HR and recruitment screening
- Community/group matching (Reddit, Discord)
- Personalized marketing

### Limitations
- 16 classes make classification challenging
- Self-reported MBTI types may be inaccurate
- Writing style varies significantly
- Dataset biased toward certain personality types
- Doesn't capture personality complexity

### Future Work
- Use deep learning (BERT, transformers)
- Binary classification for each dimension (I/E, N/S, T/F, J/P)
- Include sentiment analysis features
- Multi-language support

---

## 4. Video AI - Violence Detection

### Purpose
Detect violent activities in video content for security surveillance and content moderation applications.

### Dataset
- **Source**: [Kaggle - Real Life Violence Situations](https://www.kaggle.com/datasets/mohamedmustafa/real-life-violence-situations-dataset)
- **Total Videos**: ~2,000 videos
- **Size**: ~3.58 GB
- **Subset Used**: 60 videos (30 per class) due to computational constraints

### Input / Output
- **Input**: Video file (any common format)
- **Output**: Binary classification (Violence / Non-Violence) + Confidence

### Classes
| Class | Label |
|-------|-------|
| Violence | 1 |
| Non-Violence | 0 |

### Video Preprocessing
```python
IMG_SIZE = 64
SEQUENCE_LENGTH = 20  # frames per video

# Frame extraction and normalization
frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
frame = frame / 255.0  # Normalize to [0,1]
```

### Algorithms Tested
| Model | Architecture | Accuracy | Notes |
|-------|--------------|----------|-------|
| **CNN + LSTM** | Conv2D + MaxPool + LSTM(64) | **66.67%** | **Selected** |
| Simple CNN | Conv2D + MaxPool + Dense | 100% | Overfitting |

### CNN + LSTM Architecture
```
Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #
=================================================================
time_distributed (Conv2D)    (None, 20, 62, 62, 32)    896
time_distributed_1 (MaxPool) (None, 20, 31, 31, 32)    0
time_distributed_2 (Flatten) (None, 20, 30752)         0
lstm (LSTM)                  (None, 64)                7,889,152
dense (Dense)                (None, 1)                 65
=================================================================
Total params: 7,890,113 (30.10 MB)
```

### Training Configuration
- Epochs: 5
- Batch Size: 4
- Optimizer: Adam
- Loss: Binary Crossentropy
- Validation Split: 20%

### Final Model Performance
| Metric | Value |
|--------|-------|
| **Test Accuracy** | **66.67%** |
| Validation Loss | 0.6548 |
| Model Type | CNN + LSTM |

### Why CNN + LSTM Was Selected
- Captures temporal dependencies in video sequences
- CNN extracts spatial features from frames
- LSTM learns motion patterns across frames
- Simple CNN overfits on individual frames (100% train, poor generalization)
- Better suited for action recognition tasks

### Real-World Applications
- CCTV surveillance systems
- Social media content moderation
- Public safety monitoring
- School/workplace security
- Automated incident detection

### Limitations
- Small subset used (60 videos) due to compute constraints
- Accuracy affected by video quality
- May miss subtle violence
- False positives in sports/action content
- Requires significant processing power

### Future Work
- Train on full dataset (2000+ videos)
- Implement 3D CNN or Video Transformers
- Real-time processing optimization
- Multi-label classification (types of violence)
- Edge deployment for CCTV systems

---

## 5. Image AI - Brain Tumor MRI Classification

### Purpose
Classify brain MRI scans into tumor types to assist radiologists in medical diagnosis.

### Dataset
- **Source**: [Kaggle - Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)
- **Training Images**: 5,600
- **Testing Images**: 1,600
- **Total Images**: 7,200
- **Size**: ~157 MB

### Input / Output
- **Input**: Brain MRI scan image (any format)
- **Output**: Tumor classification + Confidence score

### Classes (4 Categories)
| Class | Description |
|-------|-------------|
| Glioma | Most common primary brain tumor |
| Meningioma | Tumor from meninges membranes |
| Pituitary | Tumor in pituitary gland |
| No Tumor | Healthy brain scan |

### Image Preprocessing
```python
IMG_SIZE = 224
BATCH_SIZE = 32

# Data Augmentation (Training)
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    zoom_range=0.1,
    horizontal_flip=True
)

# Test Data (No Augmentation)
test_gen = ImageDataGenerator(rescale=1./255)
```

### Algorithms Tested
| Model | Architecture | Training |
|-------|--------------|----------|
| Custom CNN | 3 Conv2D layers (32, 64, 128) + Dense | 8 epochs |
| **MobileNetV2** | Transfer Learning (ImageNet) | 5 epochs |
| ResNet50 | Transfer Learning (ImageNet) | 5 epochs |
| EfficientNetB0 | Transfer Learning (ImageNet) | 5 epochs |

### MobileNetV2 Architecture (Selected)
```python
# Base model (frozen)
base = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224,224,3))
base.trainable = False

# Custom classification head
x = GlobalAveragePooling2D()(base.output)
x = Dense(128, activation='relu')(x)
output = Dense(4, activation='softmax')(x)
```

### Final Model Performance
| Metric | Value |
|--------|-------|
| **Test Accuracy** | **77%** |
| Model | MobileNetV2 (Transfer Learning) |
| Input Size | 224 x 224 x 3 |
| Output Classes | 4 |

### Why MobileNetV2 Was Selected
- Pre-trained on ImageNet (1M+ images)
- Efficient architecture (mobile-friendly)
- Good balance of accuracy vs. speed
- Transfer learning reduces training time
- Works well with limited medical data

### Real-World Applications
- Hospital radiology departments
- Telemedicine diagnostic support
- Medical image screening systems
- Research and clinical trials
- Second-opinion diagnostic tool

### Limitations
- Not a replacement for professional diagnosis
- Accuracy varies with image quality
- Limited to 4 tumor categories
- May not detect rare tumor types
- Requires high-quality MRI scans

### Future Work
- Fine-tune base model layers
- Implement attention mechanisms
- Add tumor segmentation
- Multi-modal fusion (MRI + CT)
- Explainable AI (Grad-CAM visualization)

---

## Technology Stack

### Machine Learning / Deep Learning
- Python 3.x
- TensorFlow / Keras
- Scikit-learn
- XGBoost
- OpenCV
- Librosa (audio processing)

### Frontend Dashboard
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend API
- Flask
- Python
- REST API

---

## How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/neural-nexus-ai-platform.git
cd neural-nexus-ai-platform
```

### 2. Install Dependencies
```bash
# Frontend
cd ai-dashboard
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### 3. Start the Application
```bash
# Terminal 1: Backend
cd ai-dashboard/backend
ven\Script\activate or .\venv\Scripts\Activate.ps1
python export_moedel.py
python app.py

# Terminal 2: Frontend
cd ai-dashboard
npm run dev
```

### 4. Access Dashboard
Open `http://localhost:3000` in your browser.

---

## Viva Preparation

### General Questions

**Q1: What is the main objective of this project?**
> To build a unified AI platform demonstrating ML/DL applications across five different data modalities: audio, numeric, text, video, and image classification.

**Q2: Why did you choose these specific use cases?**
> Each represents a different real-world problem domain - traffic monitoring, quality prediction, personality analysis, security surveillance, and medical imaging - showcasing versatility of ML techniques.

**Q3: What is the difference between classification and regression?**
> Classification predicts discrete categories (tumor type), regression predicts continuous values (wine quality score 0-10).

---

### Audio AI Questions

**Q4: What are MFCCs and why are they important for audio?**
> MFCCs (Mel-Frequency Cepstral Coefficients) capture the spectral envelope of audio, mimicking human ear perception. They're the standard features for audio classification tasks.

**Q5: Why did you use Random Forest instead of Deep Learning for audio?**
> With only 27 samples after augmentation, deep learning would severely overfit. Random Forest works well with small datasets and extracted features.

**Q6: What is data augmentation in audio?**
> Artificially expanding dataset by adding noise and time-shifting to original audio, making the model more robust.

---

### Wine Quality Questions

**Q7: What does R² score of 0.46 mean?**
> 46% of variance in wine quality is explained by our model. It indicates moderate predictive power - wine quality is subjective and influenced by factors not in our dataset.

**Q8: Why regression instead of classification for wine quality?**
> Wine quality (0-10) is ordinal and continuous. Regression captures the magnitude of quality differences, while classification would lose this information.

**Q9: What is StandardScaler and why use it?**
> Normalizes features to zero mean and unit variance. Important for algorithms sensitive to feature scales, ensuring no single feature dominates.

---

### Personality AI Questions

**Q10: What is TF-IDF?**
> Term Frequency-Inverse Document Frequency. Weights words by importance - common words get lower weight, rare distinctive words get higher weight.

**Q11: Why Linear SVC for text classification?**
> Efficient with high-dimensional sparse data (TF-IDF vectors), fast training, and effective for multi-class text classification.

**Q12: Why is 63% accuracy acceptable for 16 classes?**
> Random baseline would be 6.25% (1/16). 63% is 10x better than random, showing meaningful pattern learning. MBTI prediction is inherently difficult due to overlapping personality traits.

---

### Video AI Questions

**Q13: Why CNN + LSTM instead of just CNN?**
> CNN alone treats frames independently and overfits (100% train accuracy). LSTM captures temporal dependencies - the sequence of actions that define violence.

**Q14: What does TimeDistributed layer do?**
> Applies the same CNN to each frame in the sequence, allowing feature extraction before temporal modeling by LSTM.

**Q15: Why only 60 videos?**
> Computational constraints. Full dataset (2000 videos) requires GPU resources. Results demonstrate proof-of-concept with smaller subset.

---

### Brain Tumor MRI Questions

**Q16: What is transfer learning?**
> Using a pre-trained model (MobileNetV2 trained on ImageNet) as feature extractor, then training only the classification head on our specific task.

**Q17: Why freeze the base model?**
> Prevents overfitting when we have limited medical images (5600). The pre-trained weights already capture general visual features.

**Q18: Why MobileNetV2 over ResNet50?**
> Lighter architecture, faster inference, suitable for deployment. Comparable accuracy with lower computational cost.

**Q19: What is data augmentation in images?**
> Rotation, zoom, flipping to artificially increase dataset diversity and reduce overfitting.

---

### Technical Questions

**Q20: How do you handle overfitting?**
> Data augmentation, dropout layers, early stopping, cross-validation, transfer learning with frozen layers, and regularization.

**Q21: What evaluation metrics did you use?**
> Accuracy, precision, recall, F1-score for classification; MSE, RMSE, R² for regression; confusion matrices for error analysis.

**Q22: What is a confusion matrix?**
> Table showing true vs predicted labels. Diagonal = correct predictions. Off-diagonal = misclassifications. Helps identify which classes are confused.

**Q23: How would you deploy this in production?**
> Containerize with Docker, deploy backend on cloud (AWS/GCP), use CDN for frontend, implement load balancing, add model versioning and monitoring.

---

### Critical Thinking Questions

**Q24: What are the ethical considerations?**
> Medical AI shouldn't replace doctors, violence detection could be misused for surveillance, personality analysis raises privacy concerns. Always use as assistive tools with human oversight.

**Q25: How would you improve each model?**
> - Audio: Larger dataset, CNN on spectrograms
> - Wine: More chemical features, ensemble methods
> - Text: BERT/transformers, binary dimension classification
> - Video: Full dataset, 3D CNN, attention mechanisms
> - Image: Fine-tuning, Grad-CAM explainability

**Q26: Why is your video/audio accuracy lower than image accuracy?**
> Temporal data is harder - requires capturing patterns across time. Also used smaller datasets due to compute constraints. Medical images have clearer visual patterns.

---

## Authors

- Developed as part of 6th Semester ML Course Project
- SGSITS, Indore

---

## License

This project is for educational purposes only. Medical AI models should not be used for actual diagnosis without professional validation.

---

**Last Updated**: March 2026
