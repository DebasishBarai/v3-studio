'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useAction, useMutation, useQuery } from "convex/react"
import { ChevronDown, ChevronUp, ImagePlay, Play, Plus, Save, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from "sonner"
import { CharacterCard } from "@/components/ui/custom/character-card"
import { SceneCard } from "@/components/ui/custom/scene-card"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/video-editor/video-player"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { parseMedia } from '@remotion/media-parser'
import { getCachedVideoUrl } from "@/lib/video-cache"
import { cn } from "@/lib/utils"


export const VideoEditorComponent = ({ videoId }: { videoId: string }) => {
  const id = videoId as Id<'videos'>;
  const video = useQuery(api.video.video.getVideo, { id: id });
  const updateVideo = useMutation(api.video.video.updateVideo);

  const [durationInSeconds, setDurationInSeconds] = useState(0)
  const [localUrl, setLocalUrl] = useState<string | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [videoData, setVideoData] = useState<Doc<'videos'>>();
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    characters: false,
    scenes: true
  });
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});
  const [expandedAngles, setExpandedAngles] = useState<Record<string, boolean>>({});

  const generateCharacterImageAction = useAction(api.video.generateVideoImage.generateCharacterImage);
  const generateSceneImageAction = useAction(api.video.generateVideoImage.generateSceneImage);
  const generateSceneVideoAction = useAction(api.video.generateVideo.generateSceneVideo)
  const generateAudioAction = useAction(api.video.generateAudio.generateAudio);
  const [generatingCharacter, setGeneratingCharacter] = useState<number | null>(null);
  const [generatingScene, setGeneratingScene] = useState<number | null>(null);
  const [modifyPrompts, setModifyPrompts] = useState<Record<number, string>>({});
  const [modifyingCharacter, setModifyingCharacter] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'Storyline' | 'Settings'>('Storyline');

  const [isSaving, setIsSaving] = useState(false);

  const musics = [
    { id: 1, title: 'Beats', previewUrl: 'https://cdn.pixabay.com/audio/2025/11/11/audio_f2cf114879.mp3', },
    { id: 2, title: 'Future Bass', previewUrl: 'https://cdn.pixabay.com/audio/2024/11/08/audio_05b10daae7.mp3', },
    { id: 3, title: 'Upbeat', previewUrl: 'https://cdn.pixabay.com/audio/2025/11/07/audio_a9bc5df6b9.mp3', },
    { id: 4, title: 'Chill', previewUrl: 'https://cdn.pixabay.com/audio/2025/10/23/audio_fc19d0fae0.mp3', },
    { id: 5, title: 'Electronic', previewUrl: 'https://cdn.pixabay.com/audio/2025/07/28/audio_944c8a9cde.mp3', },
    { id: 6, title: 'Chill Hip Hop', previewUrl: 'https://cdn.pixabay.com/audio/2025/07/01/audio_546ec56e2a.mp3', },
    { id: 7, title: 'Pop', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/13/audio_851cb5db32.mp3', },
    { id: 8, title: 'Chill Electronic', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/13/audio_38278d96ea.mp3', },
    { id: 9, title: 'Chill Pop', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/02/audio_9c1cf8951d.mp3', },
    { id: 10, title: 'Future Beats', previewUrl: 'https://cdn.pixabay.com/audio/2024/01/25/audio_8698bda9da.mp3', },
    { id: 11, title: 'Chill Beats', previewUrl: 'https://cdn.pixabay.com/audio/2024/01/02/audio_c88a26ff39.mp3', },
  ];

  const voices = [
    { id: 1, voice: { name: 'Clyde', gender: 'Male', voiceId: '2EiwWnXFnvU5JabPnv8n', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3' } },
    { id: 2, voice: { name: 'Roger', gender: 'Male', voiceId: 'CwhRBWXzGAHq8TQ4Fs17', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3' } },
    { id: 3, voice: { name: 'Sarah', gender: 'Female', voiceId: 'EXAVITQu4vr4xnSDxMaL', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3' } },
    { id: 4, voice: { name: 'Laura', gender: 'Female', voiceId: 'FGY2WhTYpPnrIDTdsKH5', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3' } },
    { id: 5, voice: { name: 'Charlie', gender: 'Male', voiceId: 'IKne3meq5aSn9XLyUdCD', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3' } },
    { id: 6, voice: { name: 'George', gender: 'Male', voiceId: 'JBFqnCBsd6RMkjVDRZzb', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3' } },
    { id: 7, voice: { name: 'Callum', gender: 'Male', voiceId: 'N2lVS1w4EtoT3dr4eOWO', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3' } },
    { id: 8, voice: { name: 'Bill', gender: 'Male', voiceId: 'pqHfZKP75CvOlQylNhV4', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3' } },
    { id: 9, voice: { name: 'Lily', gender: 'Female', voiceId: 'pFZP5JQG7iQjIQuC4Bku', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3' } },
    { id: 10, voice: { name: 'River', gender: 'Female', voiceId: 'SAz9YHcvj6GT2YYXdXww', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3' } },
    { id: 11, voice: { name: 'Harry', gender: 'Male', voiceId: 'SOYHLrjzK2X1ezoPC6cr', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3' } },
    { id: 12, voice: { name: 'Liam', gender: 'Male', voiceId: 'TX3LPaxmHKxFdv7VOQHJ', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3' } },
    { id: 13, voice: { name: 'Chris', gender: 'Male', voiceId: 'Xb7hH8MSUJpSbSDYk0k2', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3' } },
    { id: 14, voice: { name: 'Will', gender: 'Male', voiceId: 'onwK4e9ZLuTAKqWW03F9', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3' } },
    { id: 15, voice: { name: 'Jessica', gender: 'Female', voiceId: 'cgSgspJ2msm6clMCkdW9', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3' } },
    { id: 16, voice: { name: 'Brian', gender: 'Male', voiceId: 'nPczCjzI2devNBz1zQrb', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3' } },
    { id: 17, voice: { name: 'Daniel', gender: 'Male', voiceId: 'onwK4e9ZLuTAKqWW03F9', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3' } },
    { id: 18, voice: { name: 'Liam', gender: 'Male', voiceId: 'pFZP5JQG7iQjIQuC4Bku', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3' } },
    { id: 19, voice: { name: 'Alice', gender: 'Female', voiceId: 'SAz9YHcvj6GT2YYXdXww', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3' } },
    { id: 20, voice: { name: 'Matilda', gender: 'Female', voiceId: 'SOYHLrjzK2X1ezoPC6cr', previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3' } },
  ];

  // Initialize videoData from query
  useEffect(() => {
    if (video) {
      setVideoData(video);
    }
  }, [video]);

  useEffect(() => {
    const loadVideoToCache = async () => {
      if (!videoData)
        return
      if (videoData.videoUrl) {
        const videoUrl = videoData.videoUrl
        const url = await getCachedVideoUrl(videoUrl)
        setLocalUrl(url)
      } else {
        if (videoData.scenes) {
          for (const scene of videoData.scenes) {
            if (scene.videoUrl) {
              const videoUrl = scene.videoUrl
              await getCachedVideoUrl(videoUrl)
            }
          }
        }
      }
    }
    loadVideoToCache()
  })

  useEffect(() => {
    const loadVideoData = async () => {
      console.log('Loading video data...')
      if (!video || !videoData)
        return
      try {
        if (video.videoUrl) {
          const localUrl = await getCachedVideoUrl(video.videoUrl)
          const videoMetadata = await parseMedia({
            src: localUrl,
            fields: {
              slowDurationInSeconds: true,
            }
          })
          setDurationInSeconds(videoMetadata.slowDurationInSeconds)
        } else {
          console.log('No video URL found, calculating duration...')
          let totalDuration = 0

          for (const [index, scene] of video.scenes.entries()) {
            console.log(' inside for loop')
            if (scene.videoUrl) {
              if (scene.videoDurationInSeconds) {
                totalDuration += scene.videoDurationInSeconds
              } else {
                const localUrl = await getCachedVideoUrl(scene.videoUrl)
                const videoMetadata = await parseMedia({
                  src: localUrl,
                  fields: {
                    slowDurationInSeconds: true,
                  }
                })
                updateNestedField(`scenes[${index}].videoDurationInSeconds`, Math.round(videoMetadata.slowDurationInSeconds))
                totalDuration += videoMetadata.slowDurationInSeconds
                console.log('Scene duration:', videoMetadata.slowDurationInSeconds)
              }
            } else {
              totalDuration += 5
            }
          }

          setDurationInSeconds(totalDuration)
        }
      } catch (error) {
        console.error('Error loading video metadata:', error)
      } finally {
        setIsVideoLoading(false)
      }
    }

    loadVideoData()
  }, [video, videoData])


  if (!video || !videoData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading video...</div>
      </div>
    );
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleScene = (sceneIndex: number) => {
    setExpandedScenes(prev => ({ ...prev, [sceneIndex]: !prev[sceneIndex] }));
  };

  const toggleAngle = (sceneIndex: number, angleIndex: number) => {
    const key = `${sceneIndex}-${angleIndex}`;
    setExpandedAngles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: string, value: any) => {
    setVideoData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (path: string, value: any) => {
    setVideoData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const match = key.match(/(\w+)\[(\d+)\]/);

        if (match) {
          const arrayKey = match[1];
          const index = parseInt(match[2]);
          current[arrayKey] = [...current[arrayKey]];
          current = current[arrayKey][index] = { ...current[arrayKey][index] };
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addCharacter = () => {
    setVideoData((prev: any) => ({
      ...prev,
      characters: [...prev.characters, { name: "", imagePrompt: "" }]
    }));
  };

  const removeCharacter = (index: number) => {
    setVideoData((prev: any) => ({
      ...prev,
      characters: prev.characters.filter((_: any, i: number) => i !== index)
    }));
  };

  const generateCharacterImage = async ({ index, prompt, baseImageId }: { index: number, prompt: string, baseImageId?: string }) => {
    console.log('Generating character image...');
    setGeneratingCharacter(index);
    setModifyingCharacter(index);

    if (!prompt.trim()) {
      console.log('No prompt provided for character image');
      toast.error('Please enter a prompt for the character image');
      setGeneratingCharacter(null);
      return;
    }

    try {
      let result
      if (!baseImageId) {
        result = await generateCharacterImageAction({
          prompt,
          aspectRatio: videoData.aspectRatio,
        });

      } else {
        result = await generateCharacterImageAction({
          prompt,
          baseImageId: baseImageId as Id<'_storage'>,
          aspectRatio: videoData.aspectRatio,
        });
      }

      updateNestedField(`characters[${index}].imageStorageId`, result.imageStorageId);
      updateNestedField(`characters[${index}].imageUrl`, result.imageUrl);

      toast.success('Character image generated successfully!');
    } catch (error) {
      console.error('Error generating character image:', error);
      toast.error('An error occurred while generating character image');
    } finally {
      setGeneratingCharacter(null);
      setModifyingCharacter(null);
    }
  }

  const addScene = (position = 'end', afterIndex = -1) => {
    setVideoData((prev: any) => {
      const newScene = {
        index: 0,
        imagePrompt: "",
        angles: [{ index: 0, angleVideoPrompt: "" }]
      };

      let newScenes;
      if (position === 'start') {
        newScenes = [newScene, ...prev.scenes];
      } else if (position === 'after') {
        newScenes = [
          ...prev.scenes.slice(0, afterIndex + 1),
          newScene,
          ...prev.scenes.slice(afterIndex + 1)
        ];
      } else {
        newScenes = [...prev.scenes, newScene];
      }

      return {
        ...prev,
        scenes: newScenes.map((scene: any, i: number) => ({ ...scene, index: i }))
      };
    });
  };

  const removeScene = (index: number) => {
    setVideoData((prev: any) => ({
      ...prev,
      scenes: prev.scenes.filter((_: any, i: number) => i !== index).map((scene: any, i: number) => ({ ...scene, index: i }))
    }));
  };

  const addAngle = (sceneIndex: number, position = 'end', afterIndex = -1) => {
    setVideoData((prev: any) => {
      const newScenes = [...prev.scenes];
      const newAngle = { index: 0, angleVideoPrompt: "" };

      let newAngles;
      if (position === 'start') {
        newAngles = [newAngle, ...newScenes[sceneIndex].angles];
      } else if (position === 'after') {
        newAngles = [
          ...newScenes[sceneIndex].angles.slice(0, afterIndex + 1),
          newAngle,
          ...newScenes[sceneIndex].angles.slice(afterIndex + 1)
        ];
      } else {
        newAngles = [...newScenes[sceneIndex].angles, newAngle];
      }

      newScenes[sceneIndex] = {
        ...newScenes[sceneIndex],
        angles: newAngles.map((angle: any, i: number) => ({ ...angle, index: i }))
      };

      return { ...prev, scenes: newScenes };
    });
  };

  const removeAngle = (sceneIndex: number, angleIndex: number) => {
    setVideoData((prev: any) => {
      const newScenes = [...prev.scenes];
      newScenes[sceneIndex] = {
        ...newScenes[sceneIndex],
        angles: newScenes[sceneIndex].angles
          .filter((_: any, i: number) => i !== angleIndex)
          .map((angle: any, i: number) => ({ ...angle, index: i }))
      };
      return { ...prev, scenes: newScenes };
    });
  };

  const generateSceneImage = async ({ index, prompt, baseImageId, characterNames = [] }: { index: number, prompt: string, baseImageId: string, characterNames?: string[] }) => {
    console.log('Generating scene image...');
    setGeneratingScene(index);

    if (!prompt.trim()) {
      console.log('No prompt provided for scene image');
      toast.error('Please enter a prompt for the scene image');
      setGeneratingScene(null);
      return;
    }

    try {
      let result
      if (baseImageId) {
        result = await generateSceneImageAction({
          prompt,
          baseImageId: baseImageId as Id<'_storage'>,
          aspectRatio: videoData.aspectRatio,
        });

      } else {
        if (characterNames.length === 0) {
          result = await generateSceneImageAction({
            prompt,
            aspectRatio: videoData.aspectRatio,
          });

        } else {
          // Validate character names and collect image IDs
          const characterImageIds = [];
          const missingCharacters = [];
          const charactersWithoutImages = [];

          for (const characterName of characterNames) {
            // Find the character in the video.characters array
            const character = video.characters.find(
              (char) => char.name === characterName
            );

            if (!character) {
              // Character doesn't exist in the video
              missingCharacters.push(characterName);
              continue;
            }

            if (!character.imageStorageId) {
              // Character exists but image hasn't been generated yet
              charactersWithoutImages.push(characterName);
              continue;
            }

            // Character exists and has an image
            characterImageIds.push(character.imageStorageId);
          }

          // Generate appropriate error messages
          if (missingCharacters.length > 0) {
            toast.error(`Following characters not found in character set: ${missingCharacters.join(", ")}`);
            throw new Error(
              `Following characters not found in character set: ${missingCharacters.join(", ")}`
            );
          }

          if (charactersWithoutImages.length > 0) {
            toast.error(`Images not yet generated for characters: ${charactersWithoutImages.join(", ")}. Please generate images for these characters first.`);
            throw new Error(
              `Images not yet generated for characters: ${charactersWithoutImages.join(", ")}. Please generate images for these characters first.`
            );
          }
          result = await generateSceneImageAction({
            prompt,
            characterImageIds,
            aspectRatio: videoData.aspectRatio,
          });
        }
      }

      updateNestedField(`scenes[${index}].imageId`, result.imageStorageId);
      updateNestedField(`scenes[${index}].imageUrl`, result.imageUrl);

      toast.success('Scene image generated successfully!');
    } catch (error) {
      console.error('Error generating scene image:', error);
      toast.error('An error occurred while generating scene image');
    } finally {
      setGeneratingScene(null);
    }
  }

  const generateSceneVideo = async ({ index, prompt, baseImageUrl }: { index: number, prompt: string, baseImageUrl: string }) => {
    console.log('Generating scene video...');
    setGeneratingScene(index);

    if (!prompt.trim()) {
      console.log('No prompt provided for scene video');
      toast.error('Please enter a prompt for the scene video');
      setGeneratingScene(null);
      return;
    }

    try {
      const result = await generateSceneVideoAction({
        prompt,
        baseImageUrl: baseImageUrl,
      });
      updateNestedField(`scenes[${index}].videoId`, result.videoStorageId);
      updateNestedField(`scenes[${index}].videoUrl`, result.videoUrl);

      toast.success('Scene video generated successfully!');
    } catch (error) {
      console.error('Error generating scene video:', error);
      toast.error('An error occurred while generating scene video');
    } finally {
      setGeneratingScene(null);
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Remove Convex system fields before saving
      const { _id, _creationTime, userId, ...updateData } = videoData;

      await updateVideo({
        id: id,
        update: updateData
      });
      toast.success('Video saved successfully!');
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-0 px-4 lg:px-8">
      <div className="mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-12">
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('Storyline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'Storyline'
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Storyline
            </button>
            <button
              onClick={() => setActiveTab('Settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'Settings'
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Settings
            </button>
          </div>
          <div className="flex items-center gap-3">
            {/* Preview Button */}
            {/* Preview Button with Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={isSaving || isVideoLoading}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 h-9 py-2 px-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-105 transition-all text-white rounded-md"
                >
                  <Play className="w-4 h-4" />
                  Preview Video
                </Button>
              </DialogTrigger>
              <DialogContent className='!max-w-[98vw] !w-[98vw] max-h-[98vh] h-[98vh] p-6 flex flex-col'>
                <DialogHeader className='flex-shrink-0'>
                  <DialogTitle className='text-xl font-bold text-white mb-4'>Video Preview</DialogTitle>
                </DialogHeader>
                <div className="flex-1 flex items-center justify-center min-h-0">
                  {localUrl ? (
                    <video
                      src={localUrl}
                      controls
                      autoPlay
                      loop
                      className="rounded-lg max-w-full max-h-full"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div className="w-full h-full">
                      <VideoPlayer video={videoData} durationInSeconds={Math.round(durationInSeconds)} />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="mx-4 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 h-9 py-2 px-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        {/* General Settings */}
        {activeTab === 'Settings' && (
          <>
            <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl mb-6 border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection('general')}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">General Settings</h2>
                </div>
                {expandedSections.general ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
              </button>

              {expandedSections.general && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Initial Prompt</label>
                      <textarea
                        value={videoData.prompt}
                        disabled
                        rows={3}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={videoData.title || ''}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                      <input
                        type="text"
                        disabled
                        value={videoData.style}
                        onChange={(e) => updateField('style', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white cursor-not-allowed placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Music</label>
                      <select
                        value={videoData.music}
                        onChange={(e) => updateField('music', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 cursor-pointer border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>Select Music</option>
                        {musics.map((music) => (
                          <option key={music.id} value={music.title} style={{ backgroundColor: '#1E1E2D', color: 'white' }}>
                            {music.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                      <select
                        value={videoData.aspectRatio}
                        disabled
                        onChange={(e) => updateField('aspectRatio', e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 cursor-not-allowed border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="9:16" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>9:16 (Portrait)</option>
                        <option value="16:9" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>16:9 (Landscape)</option>
                        <option value="1:1" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>1:1 (Square)</option>
                      </select>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Voiceover</label>
                      <select
                        value={`${videoData.voice.name} (${videoData.voice.gender})`}
                        onChange={(e) => {
                          const selected = voices.find(v => `${v.voice.name} (${v.voice.gender})` === e.target.value);
                          if (selected) {
                            updateNestedField('voice.name', selected.voice.name);
                            updateNestedField('voice.gender', selected.voice.gender);
                          }
                        }}
                        className="w-full px-4 py-2 bg-white/5 cursor-pointer border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="" style={{ backgroundColor: '#1E1E2D', color: 'white' }}>Select Voice</option>
                        {voices.map((voice) => (
                          <option key={voice.id} value={`${voice.voice.name} (${voice.voice.gender})`} style={{ backgroundColor: '#1E1E2D', color: 'white' }}>
                            {voice.voice.name} ({voice.voice.gender})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-2"> */}
                  {/*   <input */}
                  {/*     type="checkbox" */}
                  {/*     checked={videoData.generateMultipleAngles} */}
                  {/*     onChange={(e) => updateField('generateMultipleAngles', e.target.checked)} */}
                  {/*     className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500" */}
                  {/*   /> */}
                  {/*   <label className="text-sm text-gray-300">Generate Multiple Angles</label> */}
                  {/* </div> */}
                </div>
              )}
            </div>

            {/* Characters */}
            <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl mb-6 border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleSection('characters')}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Characters ({videoData.characters.length})</h2>
                </div>
                {expandedSections.characters ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
              </button>


              {expandedSections.characters && (
                <div className="p-6 pt-0 space-y-6">
                  {/* Grid of Character Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4">
                    {videoData.characters.map((character: any, index: number) => (
                      <CharacterCard
                        key={index}
                        index={index}
                        character={character}
                        removeCharacter={removeCharacter}
                        generateCharacterImage={generateCharacterImage}
                        updateNestedField={updateNestedField}
                        modifyPrompts={modifyPrompts}
                        setModifyPrompts={setModifyPrompts}
                        generatingCharacter={generatingCharacter}
                        modifyingCharacter={modifyingCharacter}
                      />
                    ))}
                    {/* Add Character Button */}
                    <div
                      className="min-h-[250px] flex flex-col items-center cursor-pointer justify-center text-muted-foreground bg-white/5 rounded-xl p-4 border border-white/10 hover:text-white"
                      onClick={addCharacter}
                    >
                      <Plus className="w-10 h-10 mb-2" strokeWidth={2} />
                      <span className="text-lg font-medium">Add Character</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </>
        )}

        {/* Scenes */}
        {activeTab === 'Storyline' && (
          <div className="bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl mb-6 border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection('scenes')}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ImagePlay className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Scenes ({videoData.scenes.length})</h2>
              </div>
              {expandedSections.scenes ? <ChevronUp className="w-5 h-5 text-purple-400" /> : <ChevronDown className="w-5 h-5 text-purple-400" />}
            </button>

            {expandedSections.scenes && (
              <div className="p-6 pt-0 space-y-6">
                {/* Grid Layout for Scene Cards */}
                <div className={cn("grid grid-cols-1 gap-6", videoData.aspectRatio === '16:9' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4')}>
                  {videoData.scenes.map((scene: any, sceneIndex: number) => (
                    <SceneCard
                      key={sceneIndex}
                      scene={scene}
                      index={sceneIndex}
                      expandedScenes={expandedScenes}
                      expandedAngles={expandedAngles}
                      toggleScene={toggleScene}
                      toggleAngle={toggleAngle}
                      removeScene={removeScene}
                      removeAngle={removeAngle}
                      addAngle={addAngle}
                      updateNestedField={updateNestedField}
                      generatingScene={generatingScene}
                      generateSceneImage={generateSceneImage}
                      generateSceneVideo={generateSceneVideo}
                      aspectRatio={videoData.aspectRatio}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
