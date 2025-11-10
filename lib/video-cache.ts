const videoCache = new Map<string, string>();

export const getCachedVideoUrl = async (url: string): Promise<string> => {
  if (videoCache.has(url)) {
    return videoCache.get(url)!;
  }

  // Fetch the video once
  const response = await fetch(url);
  const blob = await response.blob();

  // Create a local blob URL
  const objectUrl = URL.createObjectURL(blob);

  // Store in memory cache
  videoCache.set(url, objectUrl);

  return objectUrl;
};

// Optional: clear cache manually (if memory usage matters)
export const clearVideoCache = () => {
  for (const [, objectUrl] of videoCache) {
    URL.revokeObjectURL(objectUrl);
  }
  videoCache.clear();
};
