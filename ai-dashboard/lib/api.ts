import axios from "axios";
import {
  AudioPredictionResponse,
  NumericPredictionResponse,
  TextPredictionResponse,
  VideoPredictionResponse,
  HealthPredictionResponse,
  ImagePredictionResponse,
  WineFeatures,
  HealthFeatures,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API] Response error:", error.response?.data || error.message);
    throw error;
  }
);

// Audio Traffic Prediction
export async function predictAudioTraffic(
  audioFile: File
): Promise<AudioPredictionResponse> {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const response = await api.post<AudioPredictionResponse>(
    "/api/audio/predict",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// Wine Quality Prediction
export async function predictWineQuality(
  features: WineFeatures
): Promise<NumericPredictionResponse> {
  const response = await api.post<NumericPredictionResponse>(
    "/api/numeric/predict",
    features
  );

  return response.data;
}

// Text Personality Prediction
export async function predictPersonality(
  text: string
): Promise<TextPredictionResponse> {
  const response = await api.post<TextPredictionResponse>("/api/text/predict", {
    text,
  });

  return response.data;
}

// Video Violence Prediction
export async function predictVideo(
  videoFile: File
): Promise<VideoPredictionResponse> {
  const formData = new FormData();
  formData.append("video", videoFile);

  const response = await api.post<VideoPredictionResponse>(
    "/api/video/predict",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2 minutes for video processing
    }
  );

  return response.data;
}

// Health Prediction
export async function predictHealth(
  features: HealthFeatures
): Promise<HealthPredictionResponse> {
  const response = await api.post<HealthPredictionResponse>(
    "/api/health/predict",
    features
  );

  return response.data;
}

// Brain Tumor MRI Classification
export async function predictBrainTumor(
  imageFile: File
): Promise<ImagePredictionResponse> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post<ImagePredictionResponse>(
    "/api/image/predict",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 1 minute for image processing
    }
  );

  return response.data;
}

// Mock API functions for development/demo
export async function mockPredictAudioTraffic(
  audioFile: File
): Promise<AudioPredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const levels: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  return {
    traffic: randomLevel,
    confidence: 0.75 + Math.random() * 0.2,
    spectrogram_url: "/api/placeholder/spectrogram.png",
  };
}

export async function mockPredictWineQuality(
  features: WineFeatures
): Promise<NumericPredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simple calculation based on features
  const qualityBase = 5 + (features.alcohol - 8) * 0.3 - features.volatile_acidity * 2;
  const quality = Math.max(0, Math.min(10, qualityBase + Math.random() * 1));

  let category: "Low" | "Medium" | "High";
  if (quality >= 7) category = "High";
  else if (quality >= 5) category = "Medium";
  else category = "Low";

  return {
    quality: Math.round(quality * 10) / 10,
    category,
    confidence: 0.8 + Math.random() * 0.15,
  };
}

export async function mockPredictPersonality(
  text: string
): Promise<TextPredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];

  const randomMBTI = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];

  const communityMap: Record<string, string[]> = {
    "INTJ": ["r/intj", "r/science", "r/chess", "Strategic Minds Discord"],
    "INTP": ["r/intp", "r/philosophy", "r/programming", "Tech Explorers"],
    "ENTJ": ["r/entj", "r/entrepreneur", "r/leadership", "CEO Network"],
    "ENTP": ["r/entp", "r/debate", "r/startups", "Innovation Hub"],
    "INFJ": ["r/infj", "r/psychology", "r/writing", "Empaths United"],
    "INFP": ["r/infp", "r/poetry", "r/art", "Creative Souls"],
    "ENFJ": ["r/enfj", "r/teachers", "r/motivation", "Leaders Circle"],
    "ENFP": ["r/enfp", "r/travel", "r/creativity", "Adventure Seekers"],
    "ISTJ": ["r/istj", "r/accounting", "r/organization", "Systematic Minds"],
    "ISFJ": ["r/isfj", "r/nursing", "r/volunteering", "Caring Hearts"],
    "ESTJ": ["r/estj", "r/management", "r/business", "Executives Club"],
    "ESFJ": ["r/esfj", "r/socialwork", "r/community", "Community Builders"],
    "ISTP": ["r/istp", "r/mechanics", "r/diy", "Makers Guild"],
    "ISFP": ["r/isfp", "r/photography", "r/nature", "Artistic Spirits"],
    "ESTP": ["r/estp", "r/sports", "r/adventure", "Thrill Seekers"],
    "ESFP": ["r/esfp", "r/entertainment", "r/music", "Party People"],
  };

  const topicMap: Record<string, string[]> = {
    "INTJ": ["Systems Thinking", "Long-term Planning", "Efficiency", "Strategy Games"],
    "INTP": ["Theoretical Physics", "Logic Puzzles", "Philosophy", "Programming"],
    "ENTJ": ["Business Strategy", "Leadership", "Goal Setting", "Public Speaking"],
    "ENTP": ["Debating", "Entrepreneurship", "Innovation", "Science Fiction"],
    "INFJ": ["Psychology", "Human Nature", "Writing", "Personal Growth"],
    "INFP": ["Creative Writing", "Art", "Music", "Spirituality"],
    "ENFJ": ["Coaching", "Education", "Social Causes", "Team Building"],
    "ENFP": ["Creativity", "Travel", "New Experiences", "Storytelling"],
    "ISTJ": ["History", "Organization", "Tradition", "Quality Assurance"],
    "ISFJ": ["Healthcare", "Traditions", "Family", "Helping Others"],
    "ESTJ": ["Management", "Law", "Efficiency", "Standards"],
    "ESFJ": ["Community Events", "Social Harmony", "Hospitality", "Teamwork"],
    "ISTP": ["Mechanics", "Sports", "DIY Projects", "Problem Solving"],
    "ISFP": ["Art", "Nature", "Animals", "Fashion"],
    "ESTP": ["Sports", "Adventure", "Business", "Networking"],
    "ESFP": ["Entertainment", "Performing", "Fashion", "Social Events"],
  };

  const contentMap: Record<string, string[]> = {
    "INTJ": ["Strategic planning guides", "Science documentaries", "Chess tutorials", "Productivity systems"],
    "INTP": ["Philosophy lectures", "Tech deep dives", "Logic courses", "Debate analysis"],
    "ENTJ": ["Leadership courses", "Business podcasts", "TED talks", "Biography series"],
    "ENTP": ["Debate channels", "Startup stories", "Innovation podcasts", "Sci-fi recommendations"],
    "INFJ": ["Psychology courses", "Writing workshops", "Meditation guides", "Personality content"],
    "INFP": ["Creative writing guides", "Art tutorials", "Poetry collections", "Music playlists"],
    "ENFJ": ["Teaching methods", "Motivational content", "Communication skills", "Leadership stories"],
    "ENFP": ["Travel vlogs", "Creative challenges", "Language learning", "Adventure stories"],
    "ISTJ": ["Historical documentaries", "Organizational tools", "Financial planning", "Quality guides"],
    "ISFJ": ["Healthcare tips", "Family activities", "Volunteer opportunities", "Traditional crafts"],
    "ESTJ": ["Management courses", "Business news", "Efficiency tools", "Leadership frameworks"],
    "ESFJ": ["Community guides", "Event planning", "Social skills", "Team activities"],
    "ISTP": ["DIY tutorials", "Sports analysis", "Tool reviews", "Car mechanics"],
    "ISFP": ["Art galleries", "Nature documentaries", "Music discovery", "Fashion trends"],
    "ESTP": ["Extreme sports", "Business tactics", "Networking tips", "Adventure gear"],
    "ESFP": ["Entertainment reviews", "Performance tips", "Party ideas", "Social trends"],
  };

  return {
    mbti_type: randomMBTI,
    confidence: 0.6 + Math.random() * 0.3,
    recommendations: {
      communities: communityMap[randomMBTI] || [],
      topics: topicMap[randomMBTI] || [],
      content: contentMap[randomMBTI] || [],
    },
  };
}

// Mock Video Violence Prediction
export async function mockPredictVideo(
  videoFile: File
): Promise<VideoPredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const isViolent = Math.random() > 0.5;

  return {
    violence: isViolent,
    confidence: 0.7 + Math.random() * 0.25,
    frames_analyzed: Math.floor(Math.random() * 100) + 50,
  };
}

// Mock Health Prediction
export async function mockPredictHealth(
  features: HealthFeatures
): Promise<HealthPredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simple risk calculation based on features
  let riskScore = 0;

  // Age risk
  if (features.age > 60) riskScore += 2;
  else if (features.age > 45) riskScore += 1;

  // Cholesterol risk
  if (features.chol > 240) riskScore += 2;
  else if (features.chol > 200) riskScore += 1;

  // Blood pressure risk
  if (features.trestbps > 140) riskScore += 2;
  else if (features.trestbps > 120) riskScore += 1;

  // Heart rate risk
  if (features.thalach < 100) riskScore += 1;

  // Chest pain type
  if (features.cp > 2) riskScore += 2;

  // Exercise induced angina
  if (features.exang === 1) riskScore += 2;

  // ST depression
  if (features.oldpeak > 2) riskScore += 2;
  else if (features.oldpeak > 1) riskScore += 1;

  // Determine disease and risk level
  const hasDisease = riskScore > 4;
  let risk: "Low" | "Medium" | "High";

  if (riskScore >= 7) risk = "High";
  else if (riskScore >= 4) risk = "Medium";
  else risk = "Low";

  return {
    disease: hasDisease,
    risk,
    confidence: 0.75 + Math.random() * 0.2,
  };
}

// Mock Brain Tumor MRI Classification
export async function mockPredictBrainTumor(
  imageFile: File
): Promise<ImagePredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const tumorTypes: Array<"glioma" | "meningioma" | "no_tumor" | "pituitary"> = [
    "glioma",
    "meningioma",
    "no_tumor",
    "pituitary"
  ];

  // Generate random probabilities using Dirichlet-like distribution
  const rawProbs = tumorTypes.map(() => Math.random() + 0.1);
  const sum = rawProbs.reduce((a, b) => a + b, 0);
  const normalizedProbs = rawProbs.map(p => p / sum);

  // Find the max probability index
  const maxIdx = normalizedProbs.indexOf(Math.max(...normalizedProbs));
  const prediction = tumorTypes[maxIdx];
  const confidence = normalizedProbs[maxIdx];

  const descriptions: Record<string, string> = {
    glioma: "Glioma is a type of tumor that occurs in the brain and spinal cord. It begins in the glial cells that surround nerve cells.",
    meningioma: "Meningioma is a tumor that arises from the meninges, the membranes that surround the brain and spinal cord. Most meningiomas are noncancerous.",
    pituitary: "Pituitary tumors are abnormal growths that develop in the pituitary gland. Most pituitary tumors are benign.",
    no_tumor: "No tumor detected. The MRI scan appears normal with no signs of abnormal tissue growth."
  };

  const severityMap: Record<string, "None" | "Medium" | "High"> = {
    glioma: "High",
    meningioma: "Medium",
    pituitary: "Medium",
    no_tumor: "None"
  };

  return {
    prediction,
    confidence,
    all_probabilities: {
      glioma: normalizedProbs[0],
      meningioma: normalizedProbs[1],
      no_tumor: normalizedProbs[2],
      pituitary: normalizedProbs[3],
    },
    description: descriptions[prediction],
    severity: severityMap[prediction],
  };
}

export default api;
