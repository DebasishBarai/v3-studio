'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Film, PenLine, Music, Mic, Tv, Sparkles, Play, CirclePlay, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function VideoCreatorPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<number | null>(null);
  const [playingMusic, setPlayingMusic] = useState<number | null>(null);

  const convex = useConvex()

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const styles = [
    { id: 1, name: 'Pixar 3D', image: '/short-video/style/pixar.webp' },
    { id: 2, name: 'Cinematic', image: '/short-video/style/cinematic.webp' },
    { id: 3, name: 'Ghibli', image: '/short-video/style/ghibli.webp' },
    { id: 4, name: 'Anime', image: '/short-video/style/anime.webp' },
    { id: 5, name: 'Cyberpunk', image: '/short-video/style/cyberpunk.webp' },
    { id: 6, name: 'Watercolor', image: '/short-video/style/watercolor.webp' }
  ];

  const music = [
    { id: 1, title: 'Else - Paris', url: '#' },
    { id: 2, title: 'Für Elise', url: '#' },
    { id: 3, title: 'Prelude in E minor (Op. 28 n°4)', url: '#' },
    { id: 4, title: 'Eureka', url: '#' },
    { id: 5, title: 'Tension In The Air', url: '#' },
    { id: 6, title: 'Winter', url: '#' },
    { id: 7, title: 'Bladerunner 2049', url: '#' },
    { id: 8, title: 'Snowfall', url: '#' },
    { id: 9, title: 'Another love', url: '#' },
    { id: 10, title: 'String Arpeggios', url: '#' }
  ];

  const voices = [
    { id: 1, name: 'Alloy', gender: 'Female' },
    { id: 2, name: 'Nova', gender: 'Female' },
    { id: 3, name: 'Onyx', gender: 'Male' },
    { id: 4, name: 'Sage', gender: 'Female' },
    { id: 5, name: 'Shimmer', gender: 'Female' },
    { id: 6, name: 'Verse', gender: 'Male' },
    { id: 7, name: 'Ballad', gender: 'Male' },
    { id: 8, name: 'Coral', gender: 'Female' }
  ];

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to match content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }
  }, [prompt]);

  const toggleMusicPlay = (id: number) => {
    setPlayingMusic(playingMusic === id ? null : id);
  };

  const getRandomPrompt = async () => {
    const randomPrompt = await convex.query(api.prompt.getRandomPromptVariation, {
      nounce: Math.random(),
    });

    if (randomPrompt) {
      setPrompt(randomPrompt.prompt);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-bold text-2xl flex items-center gap-2">
              <Film className="w-6 h-6" />
              Create Your Short Video
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
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
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

          {/* Background Music Section */}
          <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-xl">Background Music</h2>
            </div>
            <p className="text-gray-400 mb-4">Choose a soundtrack to set the mood.</p>
            <div className="space-y-3 max-h-[350px] overflow-auto">
              {music.map((track) => (
                <div
                  key={track.id}
                  className={`flex justify-between items-center bg-zinc-900 border rounded-lg p-3 ${selectedMusic === track.id ? 'border-blue-500' : 'border-zinc-800'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMusicPlay(track.id)}
                      className="bg-gray-700 hover:opacity-80 rounded-full p-2 transition"
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
                    className={`px-4 py-2 border rounded-md text-sm transition ${selectedMusic === track.id
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
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`bg-zinc-900 rounded-lg border p-3 flex gap-3 items-center transition ${selectedVoice === voice.id
                    ? 'border-green-500'
                    : 'border-zinc-800 hover:border-pink-400'
                    }`}
                >
                  <button className="w-12 h-12 border border-zinc-700 rounded-md flex items-center justify-center hover:bg-zinc-800 transition">
                    <CirclePlay className="w-5 h-5" />
                  </button>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{voice.name}</p>
                    <p className="text-xs text-gray-400">{voice.gender}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-4 cursor-pointer hover:from-pink-700 hover:to-purple-700 transition shadow-lg">
            <h2 className="text-xl flex gap-2 items-center justify-center text-white font-semibold">
              <Sparkles className="w-6 h-6" />
              Generate Video
            </h2>
            <p className="text-white/70 text-sm mt-1">100 Credits to Generate Video</p>
          </button>
        </div>

        {/* Preview Section */}
        <div className="col-span-1">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Tv className="w-5 h-5 text-yellow-500" />
            Preview
          </h2>
          <p className="text-gray-400 mt-1">Your video preview will appear here.</p>
          <div className="mt-4 border border-zinc-800 rounded-xl min-h-[300px] h-[80vh] flex items-center justify-center text-gray-500 bg-zinc-900/30">
            <div className="text-center">
              <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Video Preview Placeholder</p>
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
                <span className="text-gray-400">Music:</span>
                <span className={selectedMusic ? 'text-green-400' : 'text-gray-500'}>
                  {selectedMusic ? '✓ Selected' : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voice:</span>
                <span className={selectedVoice ? 'text-green-400' : 'text-gray-500'}>
                  {selectedVoice ? voices.find(v => v.id === selectedVoice)?.name : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
