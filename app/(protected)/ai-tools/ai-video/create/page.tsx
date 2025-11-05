'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Film, PenLine, Music, Mic, Tv, Sparkles, Play, CirclePlay, Pause } from 'lucide-react';
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

export default function VideoCreatorPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<number | null>(null);
  const [playingMusic, setPlayingMusic] = useState<number | null>(null);
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

  const musics = [
  { id: 1, title: 'Dreams of Home', url: 'https://pixabay.com/music/beautiful-plays-dreams-of-home-110624/' },
  { id: 2, title: 'LoFi Study', url: 'https://pixabay.com/music/lofi-lofi-study-112191/' },
  { id: 3, title: 'Sunny Morning', url: 'https://pixabay.com/music/acoustic-group-sunny-morning-5944/' },
  { id: 4, title: 'Cinematic Inspiration', url: 'https://pixabay.com/music/inspirational-cinematic-inspiration-120417/' },
  { id: 5, title: 'Energetic Pop', url: 'https://pixabay.com/music/pop-energetic-pop-113474/' },
  { id: 6, title: 'Chill Vibes', url: 'https://pixabay.com/music/lofi-chill-vibes-110005/' },
  { id: 7, title: 'Epic Adventure', url: 'https://pixabay.com/music/trailer-epic-adventure-129444/' },
  { id: 8, title: 'Calm Piano', url: 'https://pixabay.com/music/beautiful-plays-calm-piano-122215/' },
  { id: 9, title: 'Corporate Uplifting', url: 'https://pixabay.com/music/corporate-corporate-uplifting-111728/' },
  { id: 10, title: 'LoFi Chillhop', url: 'https://pixabay.com/music/lofi-lofi-chillhop-110090/' },
  { id: 11, title: 'Funky Groove', url: 'https://pixabay.com/music/funk-funky-groove-119922/' },
  { id: 12, title: 'Ambient Flow', url: 'https://pixabay.com/music/ambient-ambient-flow-127636/' },
  { id: 13, title: 'Motivational Journey', url: 'https://pixabay.com/music/inspirational-motivational-journey-111376/' },
  { id: 14, title: 'Cinematic Piano', url: 'https://pixabay.com/music/beautiful-plays-cinematic-piano-111271/' },
  { id: 15, title: 'Tropical Summer', url: 'https://pixabay.com/music/tropical-tropical-summer-116772/' },
  { id: 16, title: 'Abstract Technology', url: 'https://pixabay.com/music/electronic-abstract-technology-115669/' },
  { id: 17, title: 'Romantic Acoustic', url: 'https://pixabay.com/music/acoustic-group-romantic-acoustic-126408/' },
  { id: 18, title: 'Action Trailer', url: 'https://pixabay.com/music/trailer-action-trailer-114474/' },
  { id: 19, title: 'Peaceful Nature', url: 'https://pixabay.com/music/ambient-peaceful-nature-126995/' },
  { id: 20, title: 'Urban Night', url: 'https://pixabay.com/music/lofi-urban-night-110093/' }
];


  const voices: VoiceType[] = [
    { id: 1, voice: { name: 'Alloy', gender: 'Female' } },
    { id: 2, voice: { name: 'Nova', gender: 'Female' } },
    { id: 3, voice: { name: 'Onyx', gender: 'Male' } },
    { id: 4, voice: { name: 'Sage', gender: 'Female' } },
    { id: 5, voice: { name: 'Shimmer', gender: 'Female' } },
    { id: 6, voice: { name: 'Verse', gender: 'Male' } },
    { id: 7, voice: { name: 'Ballad', gender: 'Male' } },
    { id: 8, voice: { name: 'Coral', gender: 'Female' } }
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

  const toggleMusicPlay = (id: number) => {
    if (playingMusic === id) {
      audioRef.current?.pause();
      setPlayingMusic(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
      
      const selectedTrack = musics.find((track) => track.id === id);
      
      if (selectedTrack) {
        audioRef.current = new Audio(selectedTrack.url); 
        setPlayingMusic(id);
        audioRef.current.play().catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Playback failed:', error);
            toast.error('An error occurred while playing the audio');
          }
            setPlayingMusic(null);
        });
       
        audioRef.current.onended = () => setPlayingMusic(null);
      }
    }
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
        music: musics.find(s => s.id === selectedMusic)!.title as Infer<typeof musicValidator>,
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
                      onClick={() => toggleMusicPlay(track.id)}
                      className="bg-gray-700 hover:opacity-80 rounded-full p-2 cursor-pointer transition"
                    >
                      {playingMusic === track.id ? (
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
                <button
                  key={e.id}
                  onClick={() => setSelectedVoice(e.id)}
                  className={`bg-zinc-900 rounded-lg border p-3 cursor-pointer flex gap-3 items-center transition ${selectedVoice === e.id
                    ? 'border-green-500'
                    : 'border-zinc-800 hover:border-pink-400'
                    }`}
                >
                  <button className="w-12 h-12 border border-zinc-700 cursor-pointer rounded-md flex items-center justify-center hover:bg-zinc-800 transition">
                    <CirclePlay className="w-5 h-5" />
                  </button>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{e.voice.name}</p>
                    <p className="text-xs text-gray-400">{e.voice.gender}</p>
                  </div>
                </button>
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
