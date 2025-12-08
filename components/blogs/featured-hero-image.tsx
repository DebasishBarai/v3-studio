"use client";

import Image from "next/image";
import { useState } from "react";
import { Video } from "lucide-react";

export function FeaturedHeroImage({
  imageUrl,
}: {
  imageUrl?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const showFallback = !imageUrl || hasError;

  return (
    <div className="relative w-full h-80 rounded-2xl mb-12 overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/20">
      {/* ✅ Shimmer Skeleton */}
      {!showFallback && !isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/40 via-purple-400/50 to-purple-500/40" />
      )}

      {/* ✅ Featured Image */}
      {!showFallback && (
        <Image
          src={imageUrl}
          alt="AI-Powered Faceless Video Creation"
          fill
          priority
          className={`object-cover transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}

      {/* ✅ Fallback UI */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <Video className="w-20 h-20 mx-auto mb-4 opacity-80" />
            <p className="text-lg font-medium">
              AI-Powered Faceless Video Creation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
