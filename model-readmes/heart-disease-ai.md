# Heart Disease AI - Model Documentation

## Model Name
**Heart Disease Prediction Model (Wine Quality Predictor adapted)**

## Problem Type
**Regression** (predicting numeric wine quality score, adapted for health metrics)

**Note**: The notebook is for wine quality, but the backend API has been adapted for heart disease prediction using similar regression techniques.

## Dataset Used
**Red Wine Quality Dataset** from Kaggle (in notebook)
- **Source**: https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009
- **Format**: CSV file (`winequality-red.csv`)
- **Research**: Based on Cortez et al., 2009 study

For **Heart Disease** (in deployed API):
- Uses similar regression/classification approach
- 13 clinical features
- Binary classification (disease / no disease)

## Dataset Contents (Wine - from notebook)
- **1,599 samples** of red wine
- **12 columns**:
  1. fixed_acidity
  2. volatile_acidity
  3. citric_acid
  4. residual_sugar
  5. chlorides
  6. free_sulfur_dioxide
  7. total_sulfur_dioxide
  8. density
  9. pH
  10. sulphates
  11. alcohol
  12. **quality** (target: 0-10 score)

## Input Format
### Wine Quality (Numeric API):
```json
{
  "fixed_acidity": 7.4,
  "volatile_acidity": 0.7,
  "citric_acid": 0.0,
  "residual_sugar": 1.9,
  "chlorides": 0.076,
  "free_sulfur_dioxide": 11.0,
  "total_sulfur_dioxide": 34.0,
  "density": 0.9978,
  "pH": 3.51,
  "sulphates": 0.56,
  "alcohol": 9.4
}
```

### Heart Disease (Health API):
```json
{
  "age": 63,
  "sex": 1,
  "cp": 3,
  "trestbps": 145,
  "chol": 233,
  "fbs": 1,
  "restecg": 0,
  "thalach": 150,
  "exang": 0,
  "oldpeak": 2.3,
  "slope": 0,
  "ca": 0,
  "thal": 1
}
```

## Output Format
### Wine Quality:
```json
{
  "quality": 5.6,
  "category": "Medium",
  "confidence": 0.82
}
```

### Heart Disease:
```json
{
  "disease": true,
  "risk": "High",
  "confidence": 0.85
}
```

## What the Model Does
**Wine Quality Model**:
- Takes chemical properties of wine as input
- Predicts quality score (0-10)
- Categorizes as Low/Medium/High quality

**Heart Disease Model** (Backend adaptation):
- Takes clinical health parameters
- Predicts presence of heart disease
- Assesses risk level (Low/Medium/High)

## Key Preprocessing Used
1. **Data Cleaning**:
   - Remove duplicate rows
   - Check for missing values (none found)

2. **Feature Scaling**:
   ```python
   scaler = StandardScaler()
   X_scaled = scaler.fit_transform(X)
   ```
   - Standardize features to mean=0, std=1
   - Important for many algorithms
   - Makes features comparable

3. **Train-Test Split**:
   - 80% training data
   - 20% testing data
   - Random state 42 for reproducibility

## Features Used
**11 Chemical Features** (for wine):
1. **fixed_acidity**: Non-volatile acids contributing to tartness
2. **volatile_acidity**: Amount of acetic acid (vinegar-like)
3. **citric_acid**: Adds freshness and flavor
4. **residual_sugar**: Sugar remaining after fermentation
5. **chlorides**: Salt content
6. **free_sulfur_dioxide**: Prevents microbial growth
7. **total_sulfur_dioxide**: Total SO2 in wine
8. **density**: Mass per unit volume
9. **pH**: Acidity/alkalinity level (0-14 scale)
10. **sulphates**: Wine additive (antimicrobial, antioxidant)
11. **alcohol**: Percentage of alcohol content

**All features are continuous numeric values**

## Algorithm/Model Architecture Used
**Multiple models tested:**

| Model | RMSE | R² Score | Selected |
|-------|------|----------|----------|
| Random Forest | 0.616 | 0.464 | ✅ Best |
| Gradient Boosting | - | - | - |
| XGBoost | - | - | - |

**Selected Model**: Random Forest Regressor

**Configuration**:
```python
RandomForestRegressor(
    n_estimators=800,      # 800 decision trees
    max_depth=25,          # Maximum tree depth
    min_samples_split=4,   # Min samples to split node
    min_samples_leaf=2,    # Min samples in leaf node
    max_features='sqrt',   # Consider sqrt(n_features) at each split
    random_state=42
)
```

**Why Random Forest?**
- Handles non-linear relationships well
- Robust to outliers and noise
- No assumptions about data distribution
- Feature importance available
- Reduces overfitting through ensemble

**Other Models Configured** (not fully trained in shown output):
- Gradient Boosting (1000 estimators, lr=0.01)
- XGBoost (800 estimators, lr=0.03)

## What is Written in the Jupyter Notebook

### Notebook Structure (`numeric_final.ipynb`):
1. **Introduction Markdown**:
   - Explains wine quality prediction system
   - Input: chemical properties
   - Output: quality score + category

2. **Import Libraries**:
   - pandas, numpy, sklearn, xgboost, matplotlib

3. **Load Data**:
   - Read CSV file
   - Remove duplicates

4. **Data Preparation**:
   - Separate features (X) and target (y)
   - Apply StandardScaler to features

5. **Train-Test Split**:
   - 80-20 split with random_state=42

6. **Regression Function**:
   - Generic function to train any regression model
   - Computes MSE, RMSE, R² score
   - Returns trained model and accuracy

7. **Model Definitions**:
   - Three models configured:
     - Random Forest (best hyperparameters)
     - Gradient Boosting
     - XGBoost

8. **Model Training**:
   - Train Random Forest (model2)
   - Print evaluation metrics

9. **Visualization**:
   - Bar chart of wine quality distribution
   - Shows class imbalance

## Training Steps Described in the Notebook
1. Load red wine dataset (1,599 samples → ~1,580 after removing duplicates)
2. Separate features (11) from target (quality)
3. Scale features using StandardScaler
4. Split: 1,264 train samples, 316 test samples
5. Train Random Forest with 800 trees
6. Evaluate on test set
7. Visualize quality score distribution

## Evaluation Methods Used
1. **Mean Squared Error (MSE)**:
   - Average squared difference between predicted and actual
   - Lower is better
   - Penalizes large errors heavily

2. **Root Mean Squared Error (RMSE)**:
   - Square root of MSE
   - Same units as target variable
   - Easier to interpret

3. **R² Score (Coefficient of Determination)**:
   - Proportion of variance explained by model
   - Range: -∞ to 1.0
   - 1.0 = perfect fit
   - 0.0 = as good as mean baseline
   - Negative = worse than baseline

## Accuracy / Performance Metrics Currently Achieved

### Random Forest Results:
- **MSE**: 0.3798
- **RMSE**: 0.6163
- **R² Score**: 0.4639 (46.39%)

**Interpretation**:
- Model explains **46.39%** of variance in wine quality
- Average prediction error: **±0.62 quality points**
- Moderate performance (not great, not terrible)

**Why not higher?**
- Wine quality is subjective (human ratings)
- High variance in quality scores
- Class imbalance (mostly 5-6 quality wines)
- Limited features (chemical properties don't capture everything)
- Small dataset relative to complexity

**Quality Distribution** (from visualization):
- Most wines rated 5 or 6
- Very few wines rated 3, 4, 8
- No wines rated below 3 or above 8 in dataset

## Confidence Score Approach
For regression:
```python
# Pseudo-code for confidence estimation
confidence = 0.8 + random() * 0.15  # Fallback approach
```

Better approaches (not implemented):
- Prediction intervals from Random Forest quantiles
- Bootstrap confidence intervals
- Out-of-bag predictions for variance estimation

## Limitations
1. **Moderate Accuracy (R²=0.46)**:
   - Model only explains ~46% of variance
   - Other 54% is unexplained (human factors, measurement error)

2. **Subjective Target**:
   - Quality is based on human taste (subjective)
   - Different tasters may rate same wine differently
   - No "ground truth" for quality

3. **Limited Features**:
   - Only chemical properties included
   - Missing: grape variety, aging process, region, price
   - These factors significantly affect quality perception

4. **Class Imbalance**:
   - Mostly medium-quality wines (5-6)
   - Few extreme samples (very bad or excellent)
   - Model may struggle with edge cases

5. **Single Wine Type**:
   - Trained only on red wines
   - Won't generalize to white wines or other beverages
   - Different chemistry and characteristics

6. **Small Dataset**:
   - Only 1,599 samples (→ ~1,580 after deduplication)
   - Limits ability to capture full complexity

7. **Correlation vs Causation**:
   - Model finds correlations, not causes
   - Can't explain why certain chemicals affect quality

8. **Overfitting Risk**:
   - 800 trees with depth 25 is quite complex
   - May overfit to training data
   - Cross-validation would help assess this

## Real-World Use Case
**Wine Production Quality Control**

### Application Scenarios:

1. **Winery Quality Assurance**:
   - Test chemical properties during production
   - Predict final quality before bottling
   - Adjust fermentation process to improve quality

2. **Batch Optimization**:
   - Identify which chemical parameters to adjust
   - Maximize predicted quality score
   - Reduce waste from poor-quality batches

3. **Pricing Strategy**:
   - Predict quality to set appropriate prices
   - Higher predicted quality → premium pricing
   - Optimize profit margins

4. **Inventory Management**:
   - Prioritize high-quality wines for marketing
   - Fast-track low-quality wines to discount sales
   - Allocate resources efficiently

5. **Research & Development**:
   - Experiment with new wine recipes
   - Predict quality before full production
   - Accelerate innovation cycles

6. **Supplier Evaluation**:
   - Test grapes from different suppliers
   - Predict resulting wine quality
   - Choose best suppliers

**Heart Disease Application**:
- Screen patients for heart disease risk
- Prioritize high-risk patients for further testing
- Early intervention and prevention
- Resource allocation in healthcare

## Future Improvements
1. **Better Algorithms**:
   - Try neural networks (MLPs)
   - Gradient boosting with careful tuning (XGBoost, LightGBM, CatBoost)
   - Ensemble multiple models (stacking, blending)

2. **More Features**:
   - Add grape variety, region, vineyard
   - Include aging time, barrel type
   - Weather conditions during growing season
   - Price, brand reputation

3. **Larger Dataset**:
   - Collect more wine samples
   - Include white wines, rosé, sparkling
   - Multiple vintages and regions
   - Thousands to millions of samples

4. **Better Target**:
   - Average ratings from multiple expert tasters
   - Use continuous scale (not just integers)
   - Include confidence/variance in ratings

5. **Feature Engineering**:
   - Create ratio features (e.g., alcohol/sugar)
   - Polynomial features (interactions)
   - Domain knowledge-based features

6. **Cross-Validation**:
   - K-fold CV to assess generalization
   - Nested CV for hyperparameter tuning
   - Avoid overfitting

7. **Hyperparameter Optimization**:
   - Grid search or Bayesian optimization
   - Find optimal n_estimators, max_depth, etc.
   - Use validation set to prevent overfitting

8. **Explainability**:
   - Feature importance analysis
   - SHAP values for individual predictions
   - Help winemakers understand what drives quality

9. **Multi-Task Learning**:
   - Predict quality + price simultaneously
   - Predict quality + style (dry, sweet, etc.)
   - Shared representations may improve performance

10. **Uncertainty Quantification**:
    - Prediction intervals (e.g., quality = 6.5 ± 0.8)
    - Confidence scores based on model agreement
    - Flag uncertain predictions

11. **Online Learning**:
    - Update model with new data continuously
    - Adapt to changing tastes and trends
    - Real-time quality monitoring

12. **Domain Adaptation**:
    - Transfer learning from red to white wines
    - Adapt to different wine regions
    - Reduce need for large datasets in new domains
