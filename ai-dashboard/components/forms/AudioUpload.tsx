"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function AudioUpload({ onFileSelect, disabled }: AudioUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        onFileSelect(file);

        // Create audio element for preview
        const audioElement = new Audio(url);
        audioElement.addEventListener("ended", () => setIsPlaying(false));
        setAudio(audioElement);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/wav": [".wav"],
      "audio/x-wav": [".wav"],
    },
    maxFiles: 1,
    disabled,
  });

  const handlePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRemove = () => {
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setSelectedFile(null);
    setAudioUrl(null);
    setAudio(null);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer",
          isDragActive
            ? "border-neon-cyan bg-neon-cyan/10"
            : "border-white/20 hover:border-neon-cyan/50 hover:bg-white/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        whileTap={!disabled ? { scale: 0.99 } : undefined}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center">
          <motion.div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
              isDragActive
                ? "bg-neon-cyan/20"
                : "bg-gradient-to-br from-neon-purple/20 to-neon-pink/20"
            )}
            animate={isDragActive ? { scale: [1, 1.1, 1] } : undefined}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Upload
              className={cn(
                "w-8 h-8",
                isDragActive ? "text-neon-cyan" : "text-neon-purple"
              )}
            />
          </motion.div>

          <h3 className="text-lg font-medium text-white mb-2">
            {isDragActive
              ? "Drop your audio file here"
              : "Drag & drop audio file"}
          </h3>
          <p className="text-sm text-white/50 mb-4">or click to browse</p>
          <p className="text-xs text-white/30">Supports: .wav files only</p>
        </div>

        {/* Animated border on drag */}
        {isDragActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.5), transparent)",
              backgroundSize: "200% 100%",
            }}
          />
        )}
      </motion.div>

      {/* Selected File Preview */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
              <FileAudio className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-white/50">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white/60 hover:text-white"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-white/60 hover:text-neon-pink"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Audio Waveform Visualization */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-neon-cyan" />
                <div className="flex-1 flex items-center gap-1 h-8">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-neon-cyan to-neon-purple rounded-full"
                      animate={{
                        height: [
                          `${20 + Math.random() * 60}%`,
                          `${20 + Math.random() * 60}%`,
                        ],
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
