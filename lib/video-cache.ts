import { videoStorage } from '@/lib/indexed-db-storage';

export const getCachedVideoUrl = async (videoUrl: string): Promise<string> => {
  try {
    // Use IndexedDB to get cached video URL
    const cachedUrl = await videoStorage.getCachedVideoUrl(videoUrl);

    if (!cachedUrl) {
      throw new Error('Failed to get or cache video');
    }

    return cachedUrl;
  } catch (error) {
    console.error('Error in getCachedVideoUrl:', error);
    throw error;
  }
};

// Optional: clear cache manually
export const clearVideoCache = async (): Promise<void> => {
  try {
    await videoStorage.clearAll();
    console.log('Video cache cleared successfully');
  } catch (error) {
    console.error('Error clearing video cache:', error);
    throw error;
  }
};

// Additional utility functions
export const isVideoCached = async (videoUrl: string): Promise<boolean> => {
  return await videoStorage.hasVideo(videoUrl);
};

export const getCacheInfo = async (): Promise<{
  totalVideos: number;
  totalSizeMB: string;
  videos: Array<{ url: string; size: number; timestamp: string }>;
}> => {
  try {
    const storageInfo = await videoStorage.getStorageInfo();
    return {
      totalVideos: storageInfo.totalVideos,
      totalSizeMB: storageInfo.totalSizeMB,
      videos: storageInfo.videos
    };
  } catch (error) {
    console.error('Error getting cache info:', error);
    return { totalVideos: 0, totalSizeMB: '0.00', videos: [] };
  }
};

export const preloadVideos = async (videoUrls: string[]): Promise<Array<{
  url: string;
  success: boolean;
  error?: string;
}>> => {
  return await videoStorage.preloadVideos(videoUrls);
};
