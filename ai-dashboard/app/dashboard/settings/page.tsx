"use client";

import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  Database,
  Zap,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const settingsSections = [
  {
    title: "Appearance",
    icon: Palette,
    description: "Customize the look and feel of your dashboard",
    settings: [
      {
        name: "Theme",
        description: "Choose your preferred color theme",
        type: "buttons",
        options: [
          { label: "Dark", icon: Moon, active: true },
          { label: "Light", icon: Sun, active: false },
          { label: "System", icon: Monitor, active: false },
        ],
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Configure how you receive notifications",
    settings: [
      {
        name: "Analysis Completion",
        description: "Notify when AI analysis is complete",
        type: "toggle",
        enabled: true,
      },
      {
        name: "Error Alerts",
        description: "Show alerts when errors occur",
        type: "toggle",
        enabled: true,
      },
    ],
  },
  {
    title: "API Configuration",
    icon: Database,
    description: "Configure backend API settings",
    settings: [
      {
        name: "API Base URL",
        description: "The base URL for the ML backend API",
        type: "input",
        value: "http://localhost:5000",
        placeholder: "http://localhost:5000",
      },
      {
        name: "Request Timeout",
        description: "Maximum time to wait for API responses (ms)",
        type: "input",
        value: "30000",
        placeholder: "30000",
      },
    ],
  },
  {
    title: "Performance",
    icon: Zap,
    description: "Optimize dashboard performance",
    settings: [
      {
        name: "Enable Animations",
        description: "Show smooth animations and transitions",
        type: "toggle",
        enabled: true,
      },
      {
        name: "Auto-save History",
        description: "Automatically save analysis results",
        type: "toggle",
        enabled: true,
      },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    description: "Manage your data and privacy settings",
    settings: [
      {
        name: "Data Retention",
        description: "How long to keep analysis history",
        type: "select",
        value: "30 days",
        options: ["7 days", "30 days", "90 days", "Forever"],
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <PageWrapper
      title="Settings"
      description="Configure your Neural Nexus dashboard preferences"
    >
      <div className="space-y-6 max-w-4xl">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon;

          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {section.title}
                      </h3>
                      <p className="text-sm text-white/50 font-normal">
                        {section.description}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div
                      key={setting.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5"
                    >
                      <div className="space-y-1">
                        <Label className="text-white">{setting.name}</Label>
                        <p className="text-sm text-white/40">
                          {setting.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {setting.type === "toggle" && (
                          <motion.button
                            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                              (setting as any).enabled
                                ? "bg-neon-cyan"
                                : "bg-white/20"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                              animate={{
                                left: (setting as any).enabled ? "calc(100% - 24px)" : "4px",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          </motion.button>
                        )}

                        {setting.type === "buttons" && (
                          <div className="flex gap-1 p-1 rounded-lg bg-white/5">
                            {setting.options?.map((option) => {
                              const OptionIcon = option.icon;
                              return (
                                <Button
                                  key={option.label}
                                  variant={option.active ? "default" : "ghost"}
                                  size="sm"
                                  className="gap-2"
                                >
                                  {OptionIcon && (
                                    <OptionIcon className="w-4 h-4" />
                                  )}
                                  {option.label}
                                </Button>
                              );
                            })}
                          </div>
                        )}

                        {setting.type === "input" && (
                          <Input
                            defaultValue={setting.value}
                            placeholder={setting.placeholder}
                            className="w-64"
                          />
                        )}

                        {setting.type === "select" && (
                          <div className="flex gap-2">
                            {setting.options?.map((option) => (
                              <Badge
                                key={option}
                                variant={
                                  option === setting.value ? "neon" : "default"
                                }
                                className="cursor-pointer hover:opacity-80"
                              >
                                {option}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 space-y-2"
        >
          <p className="text-sm text-white/40">Neural Nexus AI Dashboard</p>
          <p className="text-xs text-white/20">Version 1.0.0</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="ghost" size="sm" className="text-white/40">
              Documentation
            </Button>
            <Button variant="ghost" size="sm" className="text-white/40">
              Support
            </Button>
            <Button variant="ghost" size="sm" className="text-white/40">
              Privacy Policy
            </Button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
