"use client";

import { useEffect, useState } from "react";
import { OffthreadVideo } from "remotion";
import { getCachedVideoUrl } from "../../lib/video-cache";

type Props = {
  src: string;
  muted?: boolean;
  style?: React.CSSProperties;
};

export const CachedOffthreadVideo: React.FC<Props> = ({ src, muted = true, style }) => {
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
    return <div>Loading video...</div>;
  }

  return <OffthreadVideo src={localUrl} muted={muted} style={style} />;
};
