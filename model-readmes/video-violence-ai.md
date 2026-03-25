# Video Violence AI - Model Documentation

## Model Name
**Video Violence Detection Model (CNN + LSTM)**

## Problem Type
**Binary Video Classification** (Violence / Non-Violence)

## Dataset Used
**Real Life Violence Situations Dataset** from Kaggle
- **Source**: https://www.kaggle.com/datasets/mohamedmustafa/real-life-violence-situations-dataset
- **License**: Copyright Authors
- **Size**: ~3.58GB compressed

## Dataset Contents
- **Total Videos**: ~2,000 video files
- **2 Classes**:
  1. **Violence**: Videos containing violent activities
  2. **NonViolence**: Normal, non-violent activities
- **Video Format**: MP4, AVI, MOV (various formats)
- **Source**: Real-world surveillance footage and online videos
- **Duration**: Variable (typically 5-30 seconds per clip)
- **Resolution**: Mixed (standardized during preprocessing)
- **Content Types**:
  - Violence: Fighting, assault, aggressive behavior
  - Non-Violence: Walking, talking, normal activities

## Input Format
- **File Type**: Video file (MP4, AVI, MOV, MKV, WEBM)
- **Size**: Any (processed during upload)
- **Duration**: Any length (first 20 frames extracted)
- **Resolution**: Any (resized to 64×64 during preprocessing)
- **API Endpoint**: `/api/video/predict`
- **Upload Method**: multipart/form-data with video file

## Output Format
```json
{
  "violence": true,
  "confidence": 0.85,
  "frames_analyzed": 20
}
```
- **violence**: Boolean - true if violence detected
- **confidence**: Float (0.0-1.0) - model confidence
- **frames_analyzed**: Number of frames processed

## What the Model Does
The model analyzes video sequences to detect violent activities. It processes the video by:
1. Extracting individual frames from the video
2. Analyzing spatial patterns in each frame (using CNN)
3. Analyzing temporal patterns across frames (using LSTM)
4. Predicting whether the video contains violence

**Detected Violence Types**:
- Physical fights and assaults
- Aggressive body movements
- Weapon usage
- Threatening gestures
- Chaotic scenes

**Non-Violence Examples**:
- People walking or standing
- Normal conversations
- Sports activities (non-combat)
- Everyday activities

## Key Preprocessing Used
1. **Frame Extraction**:
   ```python
   IMG_SIZE = 64
   SEQUENCE_LENGTH = 20

   # Extract up to 20 frames from video
   frames = []
   cap = cv2.VideoCapture(video_path)
   while len(frames) < SEQUENCE_LENGTH:
       ret, frame = cap.read()
       if not ret:
           break
       frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
       frame = frame / 255.0  # Normalize to [0,1]
       frames.append(frame)
   ```

2. **Frame Resizing**:
   - All frames resized to 64×64 pixels
   - Reduces computational cost
   - Standardizes input size

3. **Normalization**:
   - Pixel values normalized to [0, 1] range
   - Divides by 255 (max pixel value)
   - Improves neural network training

4. **Sequence Padding**:
   - If video has < 20 frames, pad with black frames
   - Ensures consistent input shape
   - Shape: (batch, 20, 64, 64, 3)

5. **Limited Data Loading** (due to size):
   - Only 30 videos per class loaded in notebook
   - Total: 60 videos (30 violence + 30 non-violence)
   - Necessary due to computational constraints

## Features Used
**Automatic Feature Learning** (Deep Learning):
- No manual feature engineering
- CNN learns spatial features automatically
- LSTM learns temporal features automatically

**CNN Features** (from frames):
- Edges and textures
- Body poses and positions
- Object shapes
- Motion blur indicators
- Scene composition

**LSTM Features** (across time):
- Movement patterns
- Action sequences
- Temporal dynamics
- Speed of motion changes
- Temporal correlations

## Algorithm/Model Architecture Used

### Model 1: CNN + LSTM (Primary Model)

**Architecture**:
```python
model = Sequential([
    TimeDistributed(Conv2D(32, (3,3), activation='relu'),
                    input_shape=(20, 64, 64, 3)),
    TimeDistributed(MaxPooling2D(2,2)),
    TimeDistributed(Flatten()),
    LSTM(64),
    Dense(1, activation='sigmoid')
])
```

**Layer-by-Layer Breakdown**:
1. **TimeDistributed Conv2D**:
   - Applies CNN to each frame independently
   - 32 filters of size 3×3
   - ReLU activation
   - Output: (batch, 20, 62, 62, 32)

2. **TimeDistributed MaxPooling2D**:
   - Reduces spatial dimensions by half
   - Pool size: 2×2
   - Output: (batch, 20, 31, 31, 32)

3. **TimeDistributed Flatten**:
   - Flattens each frame to 1D vector
   - Output: (batch, 20, 30752)

4. **LSTM Layer**:
   - 64 LSTM units
   - Processes temporal sequence
   - Captures motion patterns over time
   - Output: (batch, 64)

5. **Dense Output Layer**:
   - 1 neuron with sigmoid activation
   - Outputs probability: 0 (non-violence) to 1 (violence)

**Total Parameters**: 7,890,113 (30.10 MB)

**Compilation**:
- Loss: Binary crossentropy
- Optimizer: Adam
- Metrics: Accuracy

### Model 2: Simple CNN (Baseline)

**Architecture**:
```python
cnn = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(64,64,3)),
    MaxPooling2D(2,2),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')
])
```

**Purpose**: Frame-level baseline comparison
**Parameters**: 1,969,153 (7.51 MB)

## What is Written in the Jupyter Notebook

### Notebook Structure (`video_dataset.ipynb`):
1. **Introduction Markdown**:
   - Dataset description and problem type
   - Real-world use cases
   - Violence detection explanation

2. **Kaggle Setup**:
   - Upload kaggle.json API key
   - Configure Kaggle credentials
   - Download dataset (3.58GB)

3. **Data Extraction**:
   - Unzip dataset
   - Explore folder structure

4. **Import Libraries**:
   - cv2, numpy, tqdm
   - tensorflow.keras

5. **Video Loading Function**:
   - `load_videos()`: Extracts frames from videos
   - Limits to 30 videos per class (computational constraint)
   - Preprocesses frames (resize, normalize)

6. **Data Loading**:
   - Load Violence and NonViolence videos
   - Total: 60 videos (60, 20, 64, 64, 3)
   - Labels: 0=NonViolence, 1=Violence

7. **Train-Test Split**:
   - 80% train (48 videos), 20% test (12 videos)

8. **CNN + LSTM Model (Model 1)**:
   - Define architecture
   - Show summary (7.89M parameters)
   - Train for 5 epochs

9. **Evaluation (CNN + LSTM)**:
   - Test accuracy: 66.67%

10. **Simple CNN Model (Model 2)**:
    - Flatten dataset to individual frames
    - 60 videos × 20 frames = 1,200 frames
    - Train CNN on individual frames
    - Achieves 100% frame-level accuracy (likely overfitting)

11. **Visualization**:
    - Plot training/validation accuracy curves
    - Plot training/validation loss curves

12. **Confusion Matrix**:
    - Heatmap of predictions vs actual
    - Classification report

## Training Steps Described in the Notebook
1. Download 3.58GB video dataset from Kaggle
2. Extract and organize videos (Violence / NonViolence folders)
3. Load 30 videos per class (total 60 videos)
4. Extract 20 frames per video (64×64×3, normalized)
5. Split: 48 train videos, 12 test videos
6. Train CNN+LSTM model for 5 epochs (batch_size=4)
7. Evaluate on test set (12 videos)
8. Compare with baseline CNN (frame-level classification)
9. Generate confusion matrix and metrics

## Evaluation Methods Used
1. **Accuracy**:
   - Primary metric
   - Percentage of correctly classified videos
   - Both training and validation accuracy tracked

2. **Loss (Binary Crossentropy)**:
   - Measures prediction error
   - Tracked during training for monitoring

3. **Confusion Matrix**:
   - True Positives, True Negatives
   - False Positives, False Negatives
   - Visualized as heatmap

4. **Classification Report**:
   - Precision, Recall, F1-score per class
   - Overall accuracy

5. **Learning Curves**:
   - Accuracy vs epochs
   - Loss vs epochs
   - Helps identify overfitting

## Accuracy / Performance Metrics Currently Achieved

### CNN + LSTM (Primary Model):
**Test Accuracy**: **66.67%**

**Training Progress** (5 epochs):
| Epoch | Train Acc | Train Loss | Val Acc | Val Loss |
|-------|-----------|------------|---------|----------|
| 1 | 45.83% | 1.0052 | 66.67% | 0.6532 |
| 2 | 45.83% | 0.7691 | 66.67% | 0.6384 |
| 3 | 45.83% | 0.7343 | 66.67% | 0.6435 |
| 4 | 45.83% | 0.7162 | 66.67% | 0.6508 |
| 5 | 45.83% | 0.7080 | 66.67% | 0.6548 |

**Observations**:
- Validation accuracy stuck at 66.67%
- Training accuracy stuck at 45.83%
- Model is not learning well (underfitting)
- Likely due to very small dataset (48 train videos)

### Simple CNN (Frame-level):
**Test Accuracy**: **100%**

**Note**: This is frame-level accuracy, not video-level. High accuracy suggests:
- Overfitting to training data
- Frames are not representative of video-level task
- Not a fair comparison to temporal model

### Analysis:
- **Very small dataset** (60 videos total) severely limits performance
- 66.67% on 2-class problem is only slightly better than random (50%)
- Model needs significantly more data to learn properly
- Full dataset (~2,000 videos) would likely perform much better

## Confidence Score Approach
```python
if video_model is not None:
    prediction = video_model.predict(frames_input)[0][0]
    violence = bool(prediction > 0.5)
    confidence = float(prediction) if violence else float(1 - prediction)
else:
    # Fallback
    violence = random.random() > 0.5
    confidence = 0.7 + random.random() * 0.25
```

- Sigmoid output gives probability
- If > 0.5 → violence (confidence = probability)
- If ≤ 0.5 → non-violence (confidence = 1 - probability)
- Range: 0.0 to 1.0

## Limitations
1. **Extremely Small Training Set**:
   - Only 60 videos total (30 per class)
   - Only 48 training videos
   - Way too small for deep learning
   - **Full dataset has ~2,000 videos but not used** (computational constraints)

2. **Poor Model Performance (66.67%)**:
   - Barely better than random guessing
   - Indicates severe underfitting
   - Needs much more training data

3. **Computational Constraints**:
   - Notebook limited to 30 videos per class
   - Can't utilize full dataset
   - Limited training epochs (only 5)
   - Small batch size (4)

4. **Low Resolution (64×64)**:
   - Critical details may be lost
   - Faces, weapons, specific actions hard to identify
   - Standard is 224×224 or higher

5. **Short Sequences (20 frames)**:
   - May miss longer-term patterns
   - Violence can occur over many seconds
   - 20 frames ≈ 0.67 seconds at 30fps

6. **Class Imbalance (potential)**:
   - Unknown if Violence/NonViolence equally distributed
   - Model may be biased toward one class

7. **Subjective Labels**:
   - What counts as "violence" is subjective
   - Wrestling vs fighting?
   - Sports violence vs real violence?

8. **No Data Augmentation**:
   - Could use rotation, flipping, cropping
   - Would artificially increase dataset size
   - Improve generalization

9. **Binary Classification**:
   - Only detects presence/absence
   - Doesn't classify violence severity
   - Doesn't identify violence type

10. **Real-Time Challenges**:
    - Video processing is computationally expensive
    - May not run in real-time on edge devices
    - 7.89M parameters is relatively large

## Real-World Use Case
**Surveillance and Public Safety System**

### Application Scenarios:

1. **CCTV Monitoring Systems**:
   - Automatically scan security camera feeds
   - Alert security staff when violence detected
   - Reduce need for constant human monitoring
   - Faster response to incidents

2. **Smart City Surveillance**:
   - Monitor public spaces (streets, parks, stations)
   - Detect fights, assaults in real-time
   - Dispatch police or security immediately
   - Improve public safety

3. **School and Campus Safety**:
   - Monitor hallways, playgrounds, parking lots
   - Detect bullying or fights
   - Alert administrators and security
   - Prevent escalation of conflicts

4. **Retail Loss Prevention**:
   - Detect violent shoplifting or robbery attempts
   - Alert loss prevention teams
   - Protect staff and customers
   - Reduce theft-related violence

5. **Nightclub and Bar Security**:
   - Monitor crowded spaces for altercations
   - Detect fights before they escalate
   - Help bouncers respond quickly
   - Reduce injuries and liability

6. **Content Moderation**:
   - Automatically flag violent content on social media
   - YouTube, TikTok, Instagram moderation
   - Protect users from harmful content
   - Assist human moderators

7. **Police Body Cam Analysis**:
   - Automatically tag violent incidents in recordings
   - Help with evidence review
   - Identify use-of-force situations
   - Support investigations

8. **Prison Monitoring**:
   - Detect fights or assaults in facilities
   - Protect inmates and staff
   - Rapid response to incidents
   - Maintain order

9. **Sports Event Security**:
   - Monitor crowds at stadiums
   - Detect fan violence or riots
   - Coordinate security response
   - Prevent crowd-related injuries

10. **Elderly Care Facilities**:
    - Detect physical abuse or neglect
    - Protect vulnerable populations
    - Alert staff to incidents
    - Legal protection for facilities

## Future Improvements
1. **Use Full Dataset**:
   - Train on all ~2,000 videos (not just 60)
   - Will dramatically improve performance
   - Requires more computational resources
   - Use cloud GPUs (Google Colab Pro, AWS, etc.)

2. **Higher Resolution**:
   - Use 224×224 or 128×128 frames (not 64×64)
   - Preserves important visual details
   - Standard for video classification

3. **Longer Sequences**:
   - Use 40-60 frames instead of 20
   - Captures longer action sequences
   - Better temporal understanding

4. **Data Augmentation**:
   - Random rotation, flipping, cropping
   - Brightness and contrast adjustments
   - Add Gaussian noise
   - Multiply dataset size

5. **Transfer Learning**:
   - Use pre-trained CNN (ResNet, VGG, EfficientNet)
   - Pre-trained on ImageNet for spatial features
   - Faster training, better features
   - Fine-tune on violence dataset

6. **Better Architectures**:
   - 3D CNN (C3D, I3D) for spatiotemporal learning
   - Two-Stream Networks (spatial + temporal)
   - Attention mechanisms (where to focus)
   - Transformer-based models (ViViT, TimeSformer)

7. **More Training**:
   - Train for 20-50 epochs (not just 5)
   - Use learning rate scheduling
   - Early stopping on validation loss

8. **Class Balancing**:
   - Ensure equal samples per class
   - Use weighted loss if imbalanced
   - Oversample minority class

9. **Multi-Class Classification**:
   - Violence types: fighting, shooting, stabbing, etc.
   - Violence severity: mild, moderate, severe
   - Provides more actionable information

10. **Optical Flow Features**:
    - Explicitly compute motion vectors
    - Helps model focus on movement
    - Complement RGB frames

11. **Ensemble Methods**:
    - Combine multiple models (CNN+LSTM, 3D CNN, Two-Stream)
    - Voting or averaging predictions
    - Improve robustness

12. **Real-Time Optimization**:
    - Model pruning and quantization
    - Reduce parameters for faster inference
    - Deploy on edge devices (NVIDIA Jetson, Coral TPU)

13. **Explainability**:
    - Grad-CAM to visualize which regions triggered detection
    - Help understand model decisions
    - Build trust with users

14. **Temporal Action Localization**:
    - Not just detect violence, but when it occurs
    - Frame-level timestamps
    - Useful for video review

15. **Cross-Dataset Evaluation**:
    - Test on other violence datasets
    - Assess generalization
    - Avoid dataset-specific overfitting
