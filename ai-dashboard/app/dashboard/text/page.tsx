"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareText,
  Send,
  Users,
  BookOpen,
  Film,
  Sparkles,
  Brain,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RecommendationCard, ConfidenceBar } from "@/components/cards/ResultCard";
import { LoadingBrain, LoadingDots } from "@/components/ui/loading";
import { useStore } from "@/store/useStore";
import { mockPredictPersonality } from "@/lib/api";
import { TextPredictionResponse } from "@/types";
import { getMBTIColor } from "@/lib/utils";

const mbtiDescriptions: Record<string, { title: string; traits: string }> = {
  INTJ: { title: "The Architect", traits: "Strategic, independent, determined" },
  INTP: { title: "The Logician", traits: "Innovative, analytical, objective" },
  ENTJ: { title: "The Commander", traits: "Bold, imaginative, strong-willed" },
  ENTP: { title: "The Debater", traits: "Smart, curious, intellectual" },
  INFJ: { title: "The Advocate", traits: "Insightful, principled, compassionate" },
  INFP: { title: "The Mediator", traits: "Poetic, kind, altruistic" },
  ENFJ: { title: "The Protagonist", traits: "Charismatic, inspiring, natural leader" },
  ENFP: { title: "The Campaigner", traits: "Enthusiastic, creative, sociable" },
  ISTJ: { title: "The Logistician", traits: "Practical, fact-minded, reliable" },
  ISFJ: { title: "The Defender", traits: "Dedicated, warm, protective" },
  ESTJ: { title: "The Executive", traits: "Organized, logical, assertive" },
  ESFJ: { title: "The Consul", traits: "Caring, social, traditional" },
  ISTP: { title: "The Virtuoso", traits: "Bold, practical, experimental" },
  ISFP: { title: "The Adventurer", traits: "Artistic, charming, sensitive" },
  ESTP: { title: "The Entrepreneur", traits: "Energetic, perceptive, direct" },
  ESFP: { title: "The Entertainer", traits: "Spontaneous, energetic, friendly" },
};

export default function TextPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TextPredictionResponse | null>(null);

  const { textLoading, setTextLoading, addToast, addHistoryItem } = useStore();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setTextLoading(true);
    setResult(null);

    try {
      const response = await mockPredictPersonality(inputText);
      setResult(response);

      addHistoryItem({
        type: "text",
        input: inputText.slice(0, 100),
        result: response,
      });

      addToast({
        type: "success",
        title: "Analysis Complete",
        message: `Personality type detected: ${response.mbti_type}`,
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Analysis Failed",
        message: "Failed to analyze text. Please try again.",
      });
    } finally {
      setTextLoading(false);
    }
  };

  const mbtiInfo = result ? mbtiDescriptions[result.mbti_type] : null;

  return (
    <PageWrapper
      title="Personality AI"
      description="Analyze text to predict MBTI personality types and get recommendations"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-neon-orange" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chat-style input */}
              <div className="relative">
                <Textarea
                  placeholder="Write about your thoughts, interests, how you spend your time, what motivates you, or share some of your posts from social media..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] pr-12 resize-none"
                  disabled={textLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-white/30">
                  {inputText.length} characters
                </div>
              </div>

              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handleAnalyze}
                disabled={!inputText.trim() || textLoading}
              >
                {textLoading ? (
                  <span className="flex items-center gap-2">
                    <LoadingDots />
                    <span>Analyzing Personality...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Analyze Personality
                  </span>
                )}
              </Button>

              {/* Tips */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <p className="text-sm font-medium text-white/60">Tips for better results:</p>
                <div className="space-y-2 text-sm text-white/40">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-orange mt-2" />
                    <span>Write naturally about your thoughts and feelings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-orange mt-2" />
                    <span>Include how you make decisions and solve problems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-orange mt-2" />
                    <span>Describe your social preferences and energy sources</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-orange mt-2" />
                    <span>The more text you provide, the better the prediction</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-cyan" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {textLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <LoadingBrain />
                    <motion.p
                      className="mt-6 text-white/60"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Analyzing personality patterns...
                    </motion.p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* MBTI Type Card */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2,
                        }}
                        className={`text-6xl font-bold mb-2 ${getMBTIColor(
                          result.mbti_type
                        )}`}
                      >
                        {result.mbti_type}
                      </motion.div>
                      {mbtiInfo && (
                        <>
                          <p className="text-lg font-medium text-white mb-1">
                            {mbtiInfo.title}
                          </p>
                          <p className="text-sm text-white/50">{mbtiInfo.traits}</p>
                        </>
                      )}
                    </motion.div>

                    {/* Confidence */}
                    <div className="glass rounded-xl p-4">
                      <ConfidenceBar
                        value={result.confidence}
                        label="Prediction Confidence"
                        color="purple"
                      />
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-white/60 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-neon-cyan" />
                        Personalized Recommendations
                      </h4>

                      <RecommendationCard
                        title="Communities"
                        items={result.recommendations.communities}
                        icon={<Users className="w-5 h-5" />}
                        color="cyan"
                      />

                      <RecommendationCard
                        title="Topics to Explore"
                        items={result.recommendations.topics}
                        icon={<BookOpen className="w-5 h-5" />}
                        color="purple"
                      />

                      <RecommendationCard
                        title="Content Suggestions"
                        items={result.recommendations.content}
                        icon={<Film className="w-5 h-5" />}
                        color="orange"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <Brain className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">No results yet</p>
                    <p className="text-sm text-white/20">
                      Enter some text to analyze your personality type
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
