"use client";

import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { WineFeatures } from "@/types";
import { Wine, Beaker, FlaskConical, Droplets, TestTube2, Gauge } from "lucide-react";

const wineSchema = z.object({
  fixed_acidity: z.number().min(0).max(20),
  volatile_acidity: z.number().min(0).max(2),
  citric_acid: z.number().min(0).max(1),
  residual_sugar: z.number().min(0).max(20),
  chlorides: z.number().min(0).max(1),
  free_sulfur_dioxide: z.number().min(0).max(100),
  total_sulfur_dioxide: z.number().min(0).max(300),
  density: z.number().min(0.9).max(1.1),
  pH: z.number().min(2.5).max(4.5),
  sulphates: z.number().min(0).max(2),
  alcohol: z.number().min(8).max(15),
});

interface WineFormProps {
  onSubmit: (data: WineFeatures) => void;
  isLoading?: boolean;
}

const defaultValues: WineFeatures = {
  fixed_acidity: 8.0,
  volatile_acidity: 0.5,
  citric_acid: 0.3,
  residual_sugar: 2.5,
  chlorides: 0.08,
  free_sulfur_dioxide: 15,
  total_sulfur_dioxide: 50,
  density: 0.997,
  pH: 3.3,
  sulphates: 0.6,
  alcohol: 10.5,
};

const formFields = [
  {
    name: "fixed_acidity" as const,
    label: "Fixed Acidity",
    min: 0,
    max: 20,
    step: 0.1,
    unit: "g/dm³",
    icon: Beaker,
  },
  {
    name: "volatile_acidity" as const,
    label: "Volatile Acidity",
    min: 0,
    max: 2,
    step: 0.01,
    unit: "g/dm³",
    icon: FlaskConical,
  },
  {
    name: "citric_acid" as const,
    label: "Citric Acid",
    min: 0,
    max: 1,
    step: 0.01,
    unit: "g/dm³",
    icon: Droplets,
  },
  {
    name: "residual_sugar" as const,
    label: "Residual Sugar",
    min: 0,
    max: 20,
    step: 0.1,
    unit: "g/dm³",
    icon: Wine,
  },
  {
    name: "chlorides" as const,
    label: "Chlorides",
    min: 0,
    max: 1,
    step: 0.001,
    unit: "g/dm³",
    icon: TestTube2,
  },
  {
    name: "free_sulfur_dioxide" as const,
    label: "Free Sulfur Dioxide",
    min: 0,
    max: 100,
    step: 1,
    unit: "mg/dm³",
    icon: Gauge,
  },
  {
    name: "total_sulfur_dioxide" as const,
    label: "Total Sulfur Dioxide",
    min: 0,
    max: 300,
    step: 1,
    unit: "mg/dm³",
    icon: Gauge,
  },
  {
    name: "density" as const,
    label: "Density",
    min: 0.9,
    max: 1.1,
    step: 0.0001,
    unit: "g/cm³",
    icon: Droplets,
  },
  {
    name: "pH" as const,
    label: "pH Level",
    min: 2.5,
    max: 4.5,
    step: 0.01,
    unit: "",
    icon: Beaker,
  },
  {
    name: "sulphates" as const,
    label: "Sulphates",
    min: 0,
    max: 2,
    step: 0.01,
    unit: "g/dm³",
    icon: FlaskConical,
  },
  {
    name: "alcohol" as const,
    label: "Alcohol",
    min: 8,
    max: 15,
    step: 0.1,
    unit: "% vol",
    icon: Wine,
  },
];

export function WineForm({ onSubmit, isLoading }: WineFormProps) {
  const form = useForm<WineFeatures>({
    resolver: zodResolver(wineSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field, index) => {
          const Icon = field.icon;

          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-neon-cyan" />
                  <Label className="text-white/80">{field.label}</Label>
                </div>
                <Controller
                  name={field.name}
                  control={form.control}
                  render={({ field: controllerField }) => (
                    <span className="text-sm font-medium text-neon-cyan">
                      {controllerField.value?.toFixed(
                        field.step < 0.01 ? 4 : field.step < 0.1 ? 2 : 1
                      )}{" "}
                      {field.unit}
                    </span>
                  )}
                />
              </div>

              <Controller
                name={field.name}
                control={form.control}
                render={({ field: controllerField }) => (
                  <div className="flex items-center gap-4">
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
                      className="w-24 text-center"
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
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          variant="gradient"
          size="xl"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing Wine...
            </span>
          ) : (
            "Predict Wine Quality"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
