// API Types
export interface AudioPredictionResponse {
  traffic: "Low" | "Medium" | "High";
  confidence: number;
  spectrogram_url?: string;
}

export interface NumericPredictionResponse {
  quality: number;
  category: "Low" | "Medium" | "High";
  confidence?: number;
}

export interface TextPredictionResponse {
  mbti_type: string;
  confidence: number;
  recommendations: {
    communities: string[];
    topics: string[];
    content: string[];
  };
}

export interface VideoPredictionResponse {
  violence: boolean;
  confidence: number;
  frames_analyzed?: number;
}

export interface HealthPredictionResponse {
  disease: boolean;
  risk: "Low" | "Medium" | "High";
  confidence: number;
}

// Wine Input Features
export interface WineFeatures {
  fixed_acidity: number;
  volatile_acidity: number;
  citric_acid: number;
  residual_sugar: number;
  chlorides: number;
  free_sulfur_dioxide: number;
  total_sulfur_dioxide: number;
  density: number;
  pH: number;
  sulphates: number;
  alcohol: number;
}

// Health Input Features
export interface HealthFeatures {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

// History Types
export interface HistoryItem {
  id: string;
  type: "audio" | "numeric" | "text" | "video" | "health";
  timestamp: Date;
  input: string;
  result: AudioPredictionResponse | NumericPredictionResponse | TextPredictionResponse | VideoPredictionResponse | HealthPredictionResponse;
}

// API State
export interface APIState {
  loading: boolean;
  error: string | null;
}

// Toast Types
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}
