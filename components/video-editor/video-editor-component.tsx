'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useAction, useMutation, useQuery } from "convex/react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, ImagePlay, Plus, RotateCcw, Save, Settings, Trash2, User, WandSparkles } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from "sonner"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CustomButton } from "../ui/custom/custom-button"
import { CharacterCard } from "../ui/custom/character-card"


export const VideoEditorComponent = ({ videoId }: { videoId: string }) => {
  const id = videoId as Id<'videos'>;
  const video = useQuery(api.video.getVideo, { id: id });
  const updateVideo = useMutation(api.video.updateVideo);

  const [videoData, setVideoData] = useState<Doc<'videos'>>();
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    characters: false,
    scenes: true
  });
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});
  const [expandedAngles, setExpandedAngles] = useState<Record<string, boolean>>({});

  const generateCharacterImageAction = useAction(api.generateVideoImage.generateCharacterImage);
  const [generatingCharacter, setGeneratingCharacter] = useState<number | null>(null);
  const [modifyPrompts, setModifyPrompts] = useState<Record<number, string>>({});
  const [modifyingCharacter, setModifyingCharacter] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'Storyline' | 'Settings'>('Storyline');

  const [isSaving, setIsSaving] = useState(false);

  const musics = [
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
    { id: 1, voice: { name: 'Alloy', gender: 'Female' } },
    { id: 2, voice: { name: 'Nova', gender: 'Female' } },
    { id: 3, voice: { name: 'Onyx', gender: 'Male' } },
    { id: 4, voice: { name: 'Sage', gender: 'Female' } },
    { id: 5, voice: { name: 'Shimmer', gender: 'Female' } },
    { id: 6, voice: { name: 'Verse', gender: 'Male' } },
    { id: 7, voice: { name: 'Ballad', gender: 'Male' } },
    { id: 8, voice: { name: 'Coral', gender: 'Female' } }
  ];


  // Initialize videoData from query
  useEffect(() => {
    if (video) {
      setVideoData(video);
    }
  }, [video]);

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
    <div className="w-full min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-center mb-12">
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
              <div className="p-6 pt-0 space-y-4">
                {/* Add Scene at Start Button */}
                <button
                  onClick={() => addScene('start')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-green-300 rounded-lg hover:bg-white/20 transition-all border border-white/10"
                >
                  <ArrowUp className="w-5 h-5" />
                  Add Scene at Start
                </button>

                {videoData.scenes.map((scene: any, sceneIndex: number) => (
                  <div key={sceneIndex}>
                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => toggleScene(sceneIndex)}
                            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
                          >
                            <h3 className="text-lg font-semibold">Scene {sceneIndex + 1}</h3>
                            {expandedScenes[sceneIndex] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => removeScene(sceneIndex)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {expandedScenes[sceneIndex] && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Scene Image Prompt</label>
                              <textarea
                                value={scene.imagePrompt}
                                onChange={(e) => updateNestedField(`scenes[${sceneIndex}].imagePrompt`, e.target.value)}
                                rows={4}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Scene Video Prompt</label>
                              <textarea
                                value={scene.videoPrompt}
                                onChange={(e) => updateNestedField(`scenes[${sceneIndex}].videoPrompt`, e.target.value)}
                                rows={4}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                              />
                            </div>

                            {/* Angles */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-300">Angles ({scene.angles.length})</h4>

                              {/* Add Angle at Start Button */}
                              <button
                                onClick={() => addAngle(sceneIndex, 'start')}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 text-green-300 rounded-lg hover:bg-white/10 transition-all border border-white/10 text-sm"
                              >
                                <ArrowUp className="w-4 h-4" />
                                Add Angle at Start
                              </button>

                              {scene.angles.map((angle: any, angleIndex: number) => (
                                <div key={angleIndex}>
                                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                      <button
                                        onClick={() => toggleAngle(sceneIndex, angleIndex)}
                                        className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
                                      >
                                        <span className="text-sm font-medium">Angle {angleIndex + 1}</span>
                                        {expandedAngles[`${sceneIndex}-${angleIndex}`] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>
                                      {scene.angles.length > 1 && (
                                        <button
                                          onClick={() => removeAngle(sceneIndex, angleIndex)}
                                          className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                    {expandedAngles[`${sceneIndex}-${angleIndex}`] && (
                                      <textarea
                                        value={angle.angleVideoPrompt}
                                        onChange={(e) => updateNestedField(`scenes[${sceneIndex}].angles[${angleIndex}].angleVideoPrompt`, e.target.value)}
                                        rows={3}
                                        placeholder="Angle video prompt..."
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                      />
                                    )}
                                  </div>

                                  {/* Add Angle After Button */}
                                  <button
                                    onClick={() => addAngle(sceneIndex, 'after', angleIndex)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 bg-white/5 text-blue-300 rounded-lg hover:bg-white/10 transition-all border border-white/10 text-sm"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                    Add Angle After
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Scene After Button */}
                    <button
                      onClick={() => addScene('after', sceneIndex)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-3 bg-white/10 text-blue-300 rounded-lg hover:bg-white/20 transition-all border border-white/10"
                    >
                      <ArrowDown className="w-5 h-5" />
                      Add Scene After
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 h-9 py-2 px-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-all text-white rounded-md"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};
