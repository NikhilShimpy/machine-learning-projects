"use client";

import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { HealthFeatures } from "@/types";
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  User,
  Gauge,
  HeartPulse,
  Zap,
} from "lucide-react";

const healthSchema = z.object({
  age: z.number().min(1).max(120),
  sex: z.number().min(0).max(1),
  cp: z.number().min(0).max(4),
  trestbps: z.number().min(80).max(220),
  chol: z.number().min(100).max(600),
  fbs: z.number().min(0).max(1),
  restecg: z.number().min(0).max(2),
  thalach: z.number().min(60).max(220),
  exang: z.number().min(0).max(1),
  oldpeak: z.number().min(0).max(7),
  slope: z.number().min(0).max(2),
  ca: z.number().min(0).max(4),
  thal: z.number().min(0).max(3),
});

interface HealthFormProps {
  onSubmit: (data: HealthFeatures) => void;
  isLoading?: boolean;
}

const defaultValues: HealthFeatures = {
  age: 50,
  sex: 1,
  cp: 0,
  trestbps: 120,
  chol: 200,
  fbs: 0,
  restecg: 0,
  thalach: 150,
  exang: 0,
  oldpeak: 1.0,
  slope: 1,
  ca: 0,
  thal: 2,
};

const formFields = [
  {
    name: "age" as const,
    label: "Age",
    min: 1,
    max: 120,
    step: 1,
    unit: "years",
    icon: User,
    description: "Patient age in years",
  },
  {
    name: "sex" as const,
    label: "Sex",
    min: 0,
    max: 1,
    step: 1,
    unit: "",
    icon: User,
    description: "0 = Female, 1 = Male",
  },
  {
    name: "cp" as const,
    label: "Chest Pain Type",
    min: 0,
    max: 4,
    step: 1,
    unit: "",
    icon: Heart,
    description: "0-4 pain classification",
  },
  {
    name: "trestbps" as const,
    label: "Resting Blood Pressure",
    min: 80,
    max: 220,
    step: 1,
    unit: "mm Hg",
    icon: Activity,
    description: "Blood pressure at rest",
  },
  {
    name: "chol" as const,
    label: "Cholesterol",
    min: 100,
    max: 600,
    step: 1,
    unit: "mg/dl",
    icon: Droplets,
    description: "Serum cholesterol level",
  },
  {
    name: "fbs" as const,
    label: "Fasting Blood Sugar",
    min: 0,
    max: 1,
    step: 1,
    unit: "",
    icon: Thermometer,
    description: "1 if > 120 mg/dl, else 0",
  },
  {
    name: "restecg" as const,
    label: "Resting ECG",
    min: 0,
    max: 2,
    step: 1,
    unit: "",
    icon: HeartPulse,
    description: "ECG results (0-2)",
  },
  {
    name: "thalach" as const,
    label: "Max Heart Rate",
    min: 60,
    max: 220,
    step: 1,
    unit: "bpm",
    icon: Gauge,
    description: "Maximum heart rate achieved",
  },
  {
    name: "exang" as const,
    label: "Exercise Induced Angina",
    min: 0,
    max: 1,
    step: 1,
    unit: "",
    icon: Zap,
    description: "1 = Yes, 0 = No",
  },
  {
    name: "oldpeak" as const,
    label: "ST Depression",
    min: 0,
    max: 7,
    step: 0.1,
    unit: "",
    icon: Activity,
    description: "ST depression induced by exercise",
  },
  {
    name: "slope" as const,
    label: "Slope of Peak ST",
    min: 0,
    max: 2,
    step: 1,
    unit: "",
    icon: Activity,
    description: "0 = Up, 1 = Flat, 2 = Down",
  },
  {
    name: "ca" as const,
    label: "Major Vessels",
    min: 0,
    max: 4,
    step: 1,
    unit: "",
    icon: Heart,
    description: "Number colored by fluoroscopy",
  },
  {
    name: "thal" as const,
    label: "Thalassemia",
    min: 0,
    max: 3,
    step: 1,
    unit: "",
    icon: Droplets,
    description: "0-3 blood disorder type",
  },
];

export function HealthForm({ onSubmit, isLoading }: HealthFormProps) {
  const form = useForm<HealthFeatures>({
    resolver: zodResolver(healthSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formFields.map((field, index) => {
          const Icon = field.icon;

          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-neon-pink" />
                  <Label className="text-white/80 text-sm">{field.label}</Label>
                </div>
                <Controller
                  name={field.name}
                  control={form.control}
                  render={({ field: controllerField }) => (
                    <span className="text-sm font-medium text-neon-pink">
                      {typeof controllerField.value === 'number'
                        ? controllerField.value.toFixed(field.step < 1 ? 1 : 0)
                        : controllerField.value}{" "}
                      {field.unit}
                    </span>
                  )}
                />
              </div>

              <p className="text-xs text-white/40">{field.description}</p>

              <Controller
                name={field.name}
                control={form.control}
                render={({ field: controllerField }) => (
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[controllerField.value]}
                      onValueChange={(value) => controllerField.onChange(value[0])}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={controllerField.value}
                      onChange={(e) =>
                        controllerField.onChange(parseFloat(e.target.value) || 0)
                      }
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-20 text-center text-sm"
                    />
                  </div>
                )}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="submit"
          variant="gradient"
          size="xl"
          className="w-full bg-gradient-to-r from-neon-pink to-red-500 hover:from-pink-600 hover:to-red-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing Health Data...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5" />
              Predict Heart Disease Risk
            </span>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
