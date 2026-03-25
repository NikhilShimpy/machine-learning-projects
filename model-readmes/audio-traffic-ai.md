# Audio Traffic AI - Model Documentation

## Model Name
**Audio Traffic Classification Model**

## Problem Type
**Multi-class Classification** (3 classes: Low, Moderate, High)

## Dataset Used
**Road Traffic Audio Dataset** from Kaggle
- **Source**: https://www.kaggle.com/datasets/nilshmeier/road-traffic-audio
- **License**: CC-BY-NC-SA-4.0
- **Size**: ~309MB compressed

## Dataset Contents
The dataset contains:
- **46 audio samples** of road traffic in `.wav` format
- **Labels** in CSV format with timestamps
- **3 pre-labeled test samples** for each class (Low, Moderate, High traffic)
- **Audio characteristics**:
  - Format: WAV (uncompressed audio)
  - Sample rate: Variable (standardized to 22050 Hz during preprocessing)
  - Duration: Variable per clip
  - Real-world traffic audio recordings from different locations

## Input Format
- **File Type**: `.wav` audio file
- **Supported Formats**: WAV, MP3 (converted to WAV internally)
- **Sample Rate**: Automatically resampled to 22050 Hz
- **Duration**: Any length (features extracted from full audio)
- **Channels**: Mono or Stereo (converted to mono internally)

## Output Format
```json
{
  "traffic": "Low" | "Moderate" | "High",
  "confidence": 0.75
}
```
- **traffic**: Predicted traffic density level
- **confidence**: Model confidence score (0.0 to 1.0)

## What the Model Does
The model analyzes road traffic audio files and classifies them into three traffic density categories:
1. **Low Traffic**: Clear roads with minimal congestion
2. **Moderate Traffic**: Some congestion present on the road
3. **High Traffic**: Significant traffic congestion detected

The model listens to audio patterns such as:
- Number of vehicles passing
- Engine noise intensity
- Horn honking frequency
- Overall noise level and patterns

## Key Preprocessing Used
1. **Audio Loading**:
   - Load audio using librosa at 22050 Hz sample rate

2. **Data Augmentation** (3x data multiplication):
   - Original audio
   - Noise injection: Add random noise (0.5% amplitude)
   - Time shift: Shift audio by 0.2 seconds

3. **Feature Extraction**:
   - **MFCC** (Mel-Frequency Cepstral Coefficients): 20 coefficients
   - **Chroma** features: 12 pitch class features
   - **Spectral Centroid**: Center of mass of the spectrum

4. **Feature Aggregation**:
   - Compute mean across time axis for each feature
   - Concatenate all features into a single feature vector
   - Final feature vector size: ~33 features

## Features Used
**Total Features**: 33 audio features per sample

1. **MFCC Features (20)**:
   - Mean of 20 Mel-frequency cepstral coefficients
   - Captures timbre and texture of sound

2. **Chroma Features (12)**:
   - Mean of 12 chroma features (pitch classes)
   - Represents harmonic and melodic characteristics

3. **Spectral Centroid (1)**:
   - Mean spectral centroid
   - Indicates "brightness" of sound

## Algorithm/Model Architecture Used
**Algorithm**: Random Forest Classifier

**Configuration**:
- n_estimators: 200 trees
- default max_depth (unlimited)
- default min_samples_split (2)
- default min_samples_leaf (1)

**Why Random Forest?**
- Handles small datasets well
- Robust to overfitting with multiple trees
- No feature scaling required
- Good with audio features

## What is Written in the Jupyter Notebook

### Notebook Structure (`audio_final.ipynb`):
1. **Import Libraries**:
   - numpy, librosa, sklearn, matplotlib
   - RandomForestClassifier from sklearn.ensemble

2. **Load Dataset**:
   - Upload Kaggle API key
   - Download dataset from Kaggle
   - Unzip audio files

3. **Feature Extraction Function**:
   - `extract_features_from_signal()`: Extracts MFCC, chroma, spectral centroid

4. **Audio Augmentation Function**:
   - `augment_audio()`: Creates 3 versions per audio (original, noise, shift)

5. **Data Preparation**:
   - Loop through audio files
   - Extract features from augmented versions
   - Assign labels: 0=Low, 1=Moderate, 2=High
   - Total samples after augmentation: 27

6. **Label Distribution Visualization**:
   - Bar chart showing class balance

7. **Train-Test Split**:
   - 70% train, 30% test
   - Stratified split to maintain class balance

8. **Model Training**:
   - Train Random Forest with 200 estimators
   - Fit on training data

9. **Cross-Validation**:
   - 3-fold cross-validation
   - Scores: [0.889, 0.889, 0.444]

10. **Prediction & Evaluation**:
    - Predict on test set
    - Generate classification report

## Training Steps Described in the Notebook
1. Load raw audio files (9 files: 3 per class)
2. Apply data augmentation → 27 samples total
3. Extract 33 audio features per sample
4. Split into 70% train (18-19 samples) and 30% test (8-9 samples)
5. Train Random Forest with 200 trees
6. Perform 3-fold cross-validation
7. Evaluate on test set

## Evaluation Methods Used
1. **Cross-Validation Score**:
   - 3-fold CV on full dataset
   - Scores: 88.9%, 88.9%, 44.4%

2. **Classification Report**:
   - Precision, Recall, F1-score per class
   - Overall accuracy on test set

3. **Confusion Matrix** (implicit):
   - Can be derived from classification report

## Accuracy / Performance Metrics Currently Achieved

### Cross-Validation Results:
- **Fold 1**: 88.89%
- **Fold 2**: 88.89%
- **Fold 3**: 44.44%
- **Average CV Accuracy**: 74.07%

### Test Set Results (from classification report):
| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| Low (0) | 0.50 | 0.67 | 0.57 | 3 |
| Moderate (1) | 0.50 | 0.33 | 0.40 | 3 |
| High (2) | 1.00 | 1.00 | 1.00 | 3 |
| **Overall** | **0.67** | **0.67** | **0.66** | **9** |

**Test Accuracy**: 67%

**Key Observations**:
- High traffic class is perfectly predicted (100%)
- Low and moderate traffic have confusion
- Small dataset leads to variance in performance

## Confidence Score Approach
The model uses `predict_proba()` to get probability for each class:
```python
probabilities = model.predict_proba(features)[0]
confidence = float(np.max(probabilities))
```
- Returns the maximum probability as confidence
- Range: 0.0 to 1.0
- Higher confidence indicates stronger prediction

## Limitations
1. **Small Dataset**:
   - Only 9 original samples (3 per class)
   - Even after augmentation, only 27 total samples
   - Limits generalization ability

2. **Data Augmentation Quality**:
   - Simple augmentation (noise + shift)
   - May not represent real-world variations

3. **Feature Engineering**:
   - Uses hand-crafted features (MFCC, chroma)
   - Deep learning could potentially learn better features

4. **Performance Variance**:
   - 44% on one CV fold indicates instability
   - Small test set (9 samples) limits evaluation reliability

5. **Environmental Factors**:
   - Model may not generalize to different:
     - Recording conditions
     - Microphone types
     - Geographic locations
     - Weather conditions

6. **Temporal Information**:
   - Uses mean features, losing temporal dynamics
   - Could miss important patterns over time

## Real-World Use Case
**Smart Traffic Management System**

**Application Scenarios**:
1. **CCTV Audio Monitoring**:
   - Install microphones at traffic signals
   - Automatically detect congestion levels
   - Adjust signal timing dynamically

2. **Smart City Integration**:
   - Monitor multiple intersections simultaneously
   - Generate real-time traffic density maps
   - Alert traffic control centers

3. **Navigation Apps**:
   - Complement GPS data with audio analysis
   - Provide more accurate congestion information
   - Suggest alternate routes

4. **Urban Planning**:
   - Analyze traffic patterns over time
   - Identify high-congestion areas
   - Plan infrastructure improvements

5. **Emergency Services**:
   - Prioritize routes based on real-time audio data
   - Ensure faster response times

## Future Improvements
1. **Larger Dataset**:
   - Collect more diverse audio samples
   - Include different times of day, weather conditions
   - Cover various geographic locations

2. **Deep Learning Models**:
   - Use CNN or RNN architectures
   - Learn features automatically from spectrograms
   - Better capture temporal patterns

3. **Advanced Augmentation**:
   - Add background noise variations
   - Simulate different recording conditions
   - Pitch shifting, time stretching

4. **Multi-Task Learning**:
   - Predict traffic level + vehicle count
   - Identify vehicle types from audio
   - Detect anomalies (accidents, horns)

5. **Real-Time Processing**:
   - Optimize for low-latency inference
   - Deploy on edge devices
   - Continuous monitoring capability

6. **Ensemble Methods**:
   - Combine multiple models
   - Use voting or stacking
   - Improve robustness

7. **Transfer Learning**:
   - Pre-train on large audio datasets
   - Fine-tune on traffic audio
   - Leverage acoustic embeddings (e.g., VGGish)

8. **Feature Enhancement**:
   - Add Zero Crossing Rate
   - Include Spectral Rolloff
   - Use Mel Spectrograms directly as images

9. **Noise Robustness**:
   - Train with various background noises
   - Add rain, wind, construction sounds
   - Improve generalization

10. **Integration with Computer Vision**:
    - Combine audio + video analysis
    - Multi-modal traffic prediction
    - Higher accuracy through sensor fusion
