"use client";

import { useEffect, useState } from "react";
import { Audio } from "@remotion/media";
import { getCachedVideoUrl } from "../../lib/video-cache";

type Props = {
  src: string;
  volume?: number;
  loop?: boolean;
};

export const CachedAudio: React.FC<Props> = ({ src, volume = 1, loop = false }) => {
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getCachedVideoUrl(src).then((cachedUrl) => {
      if (mounted) setLocalUrl(cachedUrl);
    });

    return () => {
      mounted = false;
    };
  }, [src]);

  if (!localUrl) {
    return <div>Loading audio...</div>;
  }

  return <Audio src={localUrl} volume={volume} loop={loop} />;
};
