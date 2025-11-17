'use client'

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Film, PenLine, Music, Mic, Tv, Sparkles, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAction, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { aspectRatioValidator, musicValidator, styleValidator, voiceValidator } from '@/convex/schema';
import { Infer } from 'convex/values';
import { useRouter } from 'next/navigation';

interface VoiceType {
  id: number;
  voice: Infer<typeof voiceValidator>;
}

interface MusicType {
  id: number;
  music: Infer<typeof musicValidator>;
}

interface AudioState {
  type: 'music' | 'voice';
  id: number | string;
  url: string;
}

export default function VideoCreatorPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<number | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<AudioState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()
  const convex = useConvex()
  const createVideoBlueprint = useAction(api.video.generateVideoScript.createVideoBlueprint)

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const styles = [
    { id: 1, name: 'Pixar 3D', image: '/short-video/style/pixar.webp' },
    { id: 2, name: 'Cinematic', image: '/short-video/style/cinematic.webp' },
    { id: 3, name: 'Ghibli', image: '/short-video/style/ghibli.webp' },
    { id: 4, name: 'Anime', image: '/short-video/style/anime.webp' },
    { id: 5, name: 'Cyberpunk', image: '/short-video/style/cyberpunk.webp' },
    { id: 6, name: 'Watercolor', image: '/short-video/style/watercolor.webp' }
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9', description: 'Landscape' },
    { id: '9:16', label: '9:16', description: 'Portrait' },
    { id: '1:1', label: '1:1', description: 'Square' },
  ];

  const durations = [
    { id: 15, label: '15s', description: 'Quick' },
    { id: 30, label: '30s', description: 'Short' },
    { id: 60, label: '60s', description: 'Standard' },
    { id: 90, label: '90s', description: 'Extended' },
    { id: 120, label: '120s', description: 'Long' },
  ];

  const musics: MusicType[] = [
    { id: 1, music: { title: 'Beats', previewUrl: 'https://cdn.pixabay.com/audio/2025/11/11/audio_f2cf114879.mp3' }, },
    { id: 2, music: { title: 'Future Bass', previewUrl: 'https://cdn.pixabay.com/audio/2024/11/08/audio_05b10daae7.mp3' }, },
    { id: 3, music: { title: 'Upbeat', previewUrl: 'https://cdn.pixabay.com/audio/2025/11/07/audio_a9bc5df6b9.mp3' }, },
    { id: 4, music: { title: 'Chill', previewUrl: 'https://cdn.pixabay.com/audio/2025/10/23/audio_fc19d0fae0.mp3' }, },
    { id: 5, music: { title: 'Electronic', previewUrl: 'https://cdn.pixabay.com/audio/2025/07/28/audio_944c8a9cde.mp3' }, },
    { id: 6, music: { title: 'Chill Hip Hop', previewUrl: 'https://cdn.pixabay.com/audio/2025/07/01/audio_546ec56e2a.mp3' }, },
    { id: 7, music: { title: 'Pop', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/13/audio_851cb5db32.mp3' }, },
    { id: 8, music: { title: 'Chill Electronic', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/13/audio_38278d96ea.mp3' }, },
    { id: 9, music: { title: 'Chill Pop', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/02/audio_9c1cf8951d.mp3' }, },
    { id: 10, music: { title: 'Future Beats', previewUrl: 'https://cdn.pixabay.com/audio/2024/01/25/audio_8698bda9da.mp3' }, },
    { id: 11, music: { title: 'Chill Beats', previewUrl: 'https://cdn.pixabay.com/audio/2024/01/02/audio_c88a26ff39.mp3' }, },
  ];


  const voices: VoiceType[] = [
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

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to match content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }
  }, [prompt]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  const toggleAudioPlay = (type: 'music' | 'voice', id: number | string, url: string) => {
    const currentAudioState: AudioState = { type, id, url };

    // If clicking the same audio that's currently playing, pause it
    if (currentlyPlaying && currentlyPlaying.type === type && currentlyPlaying.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
      setCurrentlyPlaying(null);
      return;
    }

    // Stop currently playing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }

    // Play new audio
    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentlyPlaying(currentAudioState);

    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setCurrentlyPlaying(null);
      audioRef.current = null;
    });

    // Reset when audio ends
    audio.onended = () => {
      setCurrentlyPlaying(null);
      audioRef.current = null;
    };
  };

  // Helper function to check if a specific audio is currently playing
  const isAudioPlaying = (type: 'music' | 'voice', id: number | string) => {
    return currentlyPlaying?.type === type && currentlyPlaying?.id === id;
  };

  const getRandomPrompt = async () => {
    const randomPrompt = await convex.query(api.prompt.getRandomPromptVariation, {
      nounce: Math.random(),
    });

    if (randomPrompt) {
      setPrompt(randomPrompt.prompt);
    }
  };

  const generateVideo = async () => {
    if (!prompt || !selectedStyle || !selectedMusic || !selectedVoice || !selectedAspectRatio || !selectedDuration) {
      toast.error('Please fill in all the required fields');
      return;
    }
    try {
      setIsLoading(true);
      const videoId = await createVideoBlueprint({
        prompt,
        style: styles.find(s => s.id === selectedStyle)!.name as Infer<typeof styleValidator>,
        music: musics.find(s => s.id === selectedMusic)!.music as Infer<typeof musicValidator>,
        voice: voices.find(s => s.id === selectedVoice)!.voice as Infer<typeof voiceValidator>,
        aspectRatio: aspectRatios.find(s => s.id === selectedAspectRatio)!.label as Infer<typeof aspectRatioValidator>,
        durationInSecs: selectedDuration,
        numberOfImagesPerPrompt: 1,
        generateMultipleAngles: false,
      });

      router.push(`/ai-tools/ai-video/editor/${videoId}`);
    } catch (error) {
      toast.error('An error occurred while connecting to the backend');
    } finally {
      setIsLoading(false);
      setPrompt('');
      setSelectedStyle(null);
      setSelectedMusic(null);
      setSelectedVoice(null);
      setSelectedAspectRatio(null);
      setSelectedDuration(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-bold text-2xl flex items-center gap-2">
              <Film className="w-6 h-6" />
              Create Your AI Powered Video
            </h1>
            <p className="text-gray-400 mt-1">
              Write your prompt, choose a style, add music, and select a voice to generate your video.
            </p>
          </div>

          {/* Prompt Section */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <PenLine className="w-5 h-5 text-pink-500" />
                <div>
                  <h2 className="font-bold text-xl">Prompt</h2>
                  <p className="text-gray-400 text-sm">Write your own or generate with AI.</p>
                </div>
              </div>
              <button
                onClick={getRandomPrompt}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-700 cursor-pointer rounded-md hover:bg-zinc-800 transition"
              >
                <Sparkles className="w-4 h-4" />
                AI Prompt Writer
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Enter your video prompt here or let AI generate it for you..."
            />
          </div>

          {/* Video Style Section */}
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-xl">Video Style</h2>
            </div>
            <p className="text-gray-400 mb-4">Select a visual theme for your video.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {styles.map((style) => (
                <div
                  key={style.name}
                  className={cn("relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 border-gray-700 cursor-pointer", selectedStyle === style.id ? 'border-pink-500' : 'border-gray-700')}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <Image
                      alt={style.name}
                      loading="lazy"
                      width={400}
                      height={300}
                      className="w-full aspect-video object-cover rounded-lg"
                      src={style.image}
                    />
                    <h2 className="absolute bottom-0 w-full text-white text-sm font-medium bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                      {style.name}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Section */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 mb-2">
              <Tv className="w-5 h-5 text-yellow-500" />
              <h2 className="font-bold text-xl">Aspect Ratio</h2>
            </div>
            <p className="text-gray-400 mb-4">Choose the video dimensions.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedAspectRatio(ratio.id)}
                  className={`bg-zinc-900 rounded-lg border cursor-pointer p-4 text-center transition ${selectedAspectRatio === ratio.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-800 hover:border-yellow-400'
                    }`}
                >
                  <p className="font-semibold text-lg">{ratio.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{ratio.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Section */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-xl">Duration</h2>
            </div>
            <p className="text-gray-400 mb-4">Set the length of your video.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() => setSelectedDuration(duration.id)}
                  className={`bg-zinc-900 rounded-lg border cursor-pointer p-4 text-center transition ${selectedDuration === duration.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-zinc-800 hover:border-orange-400'
                    }`}
                >
                  <p className="font-semibold text-lg">{duration.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{duration.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Background Music Section */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-xl">Background Music</h2>
            </div>
            <p className="text-gray-400 mb-4">Choose a soundtrack to set the mood.</p>
            <div className="space-y-3 max-h-[350px] overflow-auto">
              {musics.map((track) => (
                <div
                  key={track.id}
                  className={`flex justify-between items-center bg-zinc-900 border rounded-lg p-3 ${selectedMusic === track.id ? 'border-blue-500' : 'border-zinc-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAudioPlay('music', track.id, track.url)}
                      className="bg-gray-700 hover:opacity-80 rounded-full p-2 cursor-pointer transition"
                    >
                      {isAudioPlaying('music', track.id) ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <p className="font-thin text-sm">{track.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMusic(track.id)}
                    className={`px-4 py-2 border rounded-md text-sm cursor-pointer transition ${selectedMusic === track.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-500 hover:bg-zinc-700'
                      }`}
                  >
                    {selectedMusic === track.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Voiceover Section */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-green-500" />
              <h2 className="font-bold text-xl">Voiceover</h2>
            </div>
            <p className="text-gray-400 mb-4">Select a voice for narration.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-auto">
              {voices.map((e) => (
                <div
                  key={e.id}
                  className={`bg-zinc-900 rounded-lg border p-3 cursor-pointer flex gap-3 items-center transition ${selectedVoice === e.id
                    ? 'border-green-500'
                    : 'border-zinc-800 hover:border-pink-400'
                    }`}
                >
                  <button className="w-12 h-12 border border-zinc-700 cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-800 transition"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent triggering the voice selection
                      toggleAudioPlay('voice', e.voice.voiceId, e.voice.previewUrl);
                    }}
                  >
                    {isAudioPlaying('voice', e.voice.voiceId) ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedVoice(e.id)}
                    className='text-left flex-1 cursor-pointer'
                  >
                    <p className="font-semibold text-sm">{e.voice.name}</p>
                    <p className="text-xs text-gray-400">{e.voice.gender}</p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="mt-6 p-4 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <h3 className="font-semibold mb-3">Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Prompt:</span>
                <span className={prompt ? 'text-green-400' : 'text-gray-500'}>
                  {prompt ? '✓ Ready' : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Style:</span>
                <span className={selectedStyle ? 'text-green-400' : 'text-gray-500'}>
                  {selectedStyle ? styles.find(s => s.id === selectedStyle)?.name : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Aspect Ratio:</span>
                <span className={selectedAspectRatio ? 'text-green-400' : 'text-gray-500'}>
                  {selectedAspectRatio || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className={selectedDuration ? 'text-green-400' : 'text-gray-500'}>
                  {selectedDuration ? `${selectedDuration}s` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Music:</span>
                <span className={selectedMusic ? 'text-green-400' : 'text-gray-500'}>
                  {selectedMusic ? '✓ Selected' : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voice:</span>
                <span className={selectedVoice ? 'text-green-400' : 'text-gray-500'}>
                  {selectedVoice ? voices.find(v => v.id === selectedVoice)?.voice.name : 'Not set'}
                </span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-4 cursor-pointer hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
            disabled={isLoading}
            onClick={generateVideo}
          >
            <h2 className="text-xl flex gap-2 items-center justify-center text-white font-semibold">
              <Sparkles className="w-6 h-6" />
              {isLoading ? 'Generating...' : 'Generate Outline'}
            </h2>
            <p className="text-white/70 text-sm mt-1">10 Credits to Generate Outline</p>
          </button>
        </div>
      </div>
    </div>
  );
}
