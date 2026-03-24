"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Upload, X, AlertCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ onFileSelect, disabled }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const imageFile = acceptedFiles[0];

      if (imageFile) {
        // Validate file size (max 10MB)
        if (imageFile.size > 10 * 1024 * 1024) {
          setError("File size must be less than 10MB");
          return;
        }

        // Validate file type
        if (!imageFile.type.startsWith("image/")) {
          setError("Please upload a valid image file");
          return;
        }

        setFile(imageFile);
        onFileSelect(imageFile);

        // Create preview URL
        const url = URL.createObjectURL(imageFile);
        setImageUrl(url);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled,
  });

  const removeFile = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setFile(null);
    setImageUrl(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer",
              isDragActive
                ? "border-neon-cyan bg-neon-cyan/10"
                : "border-white/20 hover:border-neon-cyan/50 hover:bg-white/5",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center mb-4"
              >
                {isDragActive ? (
                  <Upload className="w-8 h-8 text-neon-cyan" />
                ) : (
                  <Brain className="w-8 h-8 text-neon-cyan" />
                )}
              </motion.div>

              <h3 className="text-lg font-medium text-white mb-2">
                {isDragActive ? "Drop your MRI scan here" : "Upload Brain MRI Scan"}
              </h3>

              <p className="text-sm text-white/50 mb-4">
                Drag & drop or click to select
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {[".jpg", ".jpeg", ".png", ".bmp"].map((format) => (
                  <span
                    key={format}
                    className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/40"
                  >
                    {format}
                  </span>
                ))}
              </div>

              <p className="text-xs text-white/30 mt-3">Max file size: 10MB</p>
            </div>

            {/* Animated border */}
            {isDragActive && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative glass rounded-2xl p-4"
          >
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-square mb-4 max-h-64 mx-auto">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="MRI Preview"
                  className="w-full h-full object-contain"
                />
              )}
              {/* MRI overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent pointer-events-none" />
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-white/40">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={disabled}
                className="text-white/40 hover:text-red-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
