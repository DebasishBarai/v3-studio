const DB_NAME = 'VideoStorageDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

interface VideoData {
  videoUrl: string;
  blob: Blob;
  timestamp: string;
  size: number;
  type: string;
}

interface StorageInfo {
  totalVideos: number;
  totalSize: number;
  totalSizeMB: string;
  videos: Array<{
    url: string;
    size: number;
    timestamp: string;
  }>;
}

class VideoStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase>;
  // Track ongoing storeVideo operations to prevent duplicates
  private pendingStoreOperations = new Map<string, Promise<string>>();

  constructor() {
    this.initPromise = this.init();
  }

  private async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'videoUrl' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async storeVideo(videoUrl: string): Promise<string> {
    if (!this.db) await this.initPromise;

    // ADD THIS: Check if this video is already being stored
    if (this.pendingStoreOperations.has(videoUrl)) {
      console.log('Reusing existing store operation for:', videoUrl);
      return this.pendingStoreOperations.get(videoUrl)!;
    }

    const storePromise: Promise<string> = new Promise(async (resolve, reject) => {
      try {
        // Check if video already exists
        const existing = await this.getVideo(videoUrl);
        if (existing) {
          console.log('Video already cached:', videoUrl);
          return resolve(videoUrl);
        }

        // Fetch video as blob
        console.log('Downloading video:', videoUrl);
        const response = await fetch(videoUrl);
        const blob = await response.blob();

        const videoData: VideoData = {
          videoUrl: videoUrl,
          blob: blob,
          timestamp: new Date().toISOString(),
          size: blob.size,
          type: blob.type
        };

        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.add(videoData);

        request.onsuccess = () => {
          console.log('Video stored successfully:', videoUrl, `(${(blob.size / (1024 * 1024)).toFixed(2)} MB)`);
          resolve(videoUrl);
        };

        request.onerror = () => reject(request.error);

      } catch (error) {
        reject(error);
      } finally {
        // ADD THIS: Always clean up when operation completes
        this.pendingStoreOperations.delete(videoUrl);
      }
    });


    // ADD THIS: Store the promise for deduplication
    this.pendingStoreOperations.set(videoUrl, storePromise);

    return storePromise;
  }

  async getVideo(videoUrl: string): Promise<VideoData | undefined> {
    if (!this.db) await this.initPromise;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(videoUrl);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getVideoUrl(videoUrl: string): Promise<string | null> {
    try {
      const videoData = await this.getVideo(videoUrl);
      if (!videoData) return null;

      return URL.createObjectURL(videoData.blob);
    } catch (error) {
      console.error('Error getting video URL:', error);
      return null;
    }
  }

  async hasVideo(videoUrl: string): Promise<boolean> {
    const videoData = await this.getVideo(videoUrl);
    return videoData !== undefined;
  }

  async getAllVideoUrls(): Promise<string[]> {
    if (!this.db) await this.initPromise;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteVideo(videoUrl: string): Promise<boolean> {
    if (!this.db) await this.initPromise;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(videoUrl);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageInfo(): Promise<StorageInfo> {
    if (!this.db) await this.initPromise;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const allVideos: VideoData[] = request.result;
        const totalSize = allVideos.reduce((sum, video) => sum + (video.size || 0), 0);
        const totalCount = allVideos.length;

        resolve({
          totalVideos: totalCount,
          totalSize: totalSize,
          totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
          videos: allVideos.map(v => ({
            url: v.videoUrl,
            size: v.size,
            timestamp: v.timestamp
          }))
        });
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<boolean> {
    if (!this.db) await this.initPromise;

    // ADD THIS: Clear pending operations
    this.pendingStoreOperations.clear();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Utility method to get cached video URL with automatic caching
  async getCachedVideoUrl(videoUrl: string): Promise<string | null> {
    try {
      // Check if already cached
      const cached = await this.getVideoUrl(videoUrl);
      if (cached) {
        console.log('Returning cached video for:', videoUrl);
        return cached;
      }

      // If not cached, download and store
      console.log('Downloading and caching video:', videoUrl);
      await this.storeVideo(videoUrl);

      // Return the cached URL
      const newCached = await this.getVideoUrl(videoUrl);
      return newCached;
    } catch (error) {
      console.error('Error in getCachedVideoUrl:', error);
      return null;
    }
  }

  // Preload multiple videos
  async preloadVideos(videoUrls: string[]): Promise<Array<{ url: string; success: boolean; error?: string }>> {
    const results: Array<{ url: string; success: boolean; error?: string }> = [];

    for (const url of videoUrls) {
      try {
        const cachedUrl = await this.getCachedVideoUrl(url);
        results.push({
          url,
          success: true
        });
      } catch (error) {
        results.push({
          url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }
}

// Create singleton instance
export const videoStorage = new VideoStorage();
