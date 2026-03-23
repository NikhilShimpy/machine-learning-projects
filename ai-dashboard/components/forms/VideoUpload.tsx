"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Video, Upload, X, Play, Pause, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  uploadProgress?: number;
}

export function VideoUpload({ onFileSelect, disabled, uploadProgress }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const videoFile = acceptedFiles[0];

      if (videoFile) {
        // Validate file size (max 100MB)
        if (videoFile.size > 100 * 1024 * 1024) {
          setError("File size must be less than 100MB");
          return;
        }

        // Validate file type
        if (!videoFile.type.startsWith("video/")) {
          setError("Please upload a valid video file");
          return;
        }

        setFile(videoFile);
        onFileSelect(videoFile);

        // Create preview URL
        const url = URL.createObjectURL(videoFile);
        setVideoUrl(url);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".avi", ".mov", ".mkv", ".webm"],
    },
    maxFiles: 1,
    disabled,
  });

  const removeFile = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    onFileSelect(null);
  };

  const togglePlay = () => {
    const video = document.getElementById("video-preview") as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
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
                ? "border-red-500 bg-red-500/10"
                : "border-white/20 hover:border-red-500/50 hover:bg-white/5",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-neon-orange/20 flex items-center justify-center mb-4"
              >
                {isDragActive ? (
                  <Upload className="w-8 h-8 text-red-500" />
                ) : (
                  <Video className="w-8 h-8 text-red-400" />
                )}
              </motion.div>

              <h3 className="text-lg font-medium text-white mb-2">
                {isDragActive ? "Drop your video here" : "Upload Video File"}
              </h3>

              <p className="text-sm text-white/50 mb-4">
                Drag & drop or click to select
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {[".mp4", ".avi", ".mov", ".mkv"].map((format) => (
                  <span
                    key={format}
                    className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/40"
                  >
                    {format}
                  </span>
                ))}
              </div>

              <p className="text-xs text-white/30 mt-3">Max file size: 100MB</p>
            </div>

            {/* Animated border */}
            {isDragActive && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3), transparent)",
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
            {/* Video Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-4">
              {videoUrl && (
                <video
                  id="video-preview"
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              {/* Play/Pause overlay */}
              <motion.button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
              </motion.button>
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-neon-orange flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-white/40">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
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

            {/* Upload Progress */}
            {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Uploading...</span>
                  <span className="text-xs text-neon-cyan">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </motion.div>
            )}
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
