'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useAction, useMutation, useQuery } from "convex/react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, ImagePlay, Plus, Save, Settings, Trash2, User, Video } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from "sonner"
import { Button } from "../ui/button"
import Link from "next/link"


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

  const [isSaving, setIsSaving] = useState(false);

  // Initialize videoData from query
  useEffect(() => {
    if (video) {
      setVideoData(video);
    }
  }, [video]);

  if (!video || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading video...</div>
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
    setGeneratingCharacter(index);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Video Editor</h1>
                <p className="text-purple-200 text-sm">ID: {videoData._id}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl mb-6 border border-white/20 overflow-hidden">
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
                  <label className="block text-sm font-medium text-purple-200 mb-2">Initial Prompt</label>
                  <textarea
                    value={videoData.prompt}
                    disabled
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-purple-200 mb-2">Title</label>
                  <input
                    type="text"
                    value={videoData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Style</label>
                  <input
                    type="text"
                    value={videoData.style}
                    onChange={(e) => updateField('style', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Music</label>
                  <input
                    type="text"
                    value={videoData.music}
                    onChange={(e) => updateField('music', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Aspect Ratio</label>
                  <select
                    value={videoData.aspectRatio}
                    onChange={(e) => updateField('aspectRatio', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Voice Gender</label>
                  <input
                    type="text"
                    value={videoData.voice.gender}
                    onChange={(e) => updateNestedField('voice.gender', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Voice Name</label>
                  <input
                    type="text"
                    value={videoData.voice.name}
                    onChange={(e) => updateNestedField('voice.name', e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={videoData.generateMultipleAngles}
                  onChange={(e) => updateField('generateMultipleAngles', e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                <label className="text-sm text-purple-200">Generate Multiple Angles</label>
              </div>
            </div>
          )}
        </div>

        {/* Characters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl mb-6 border border-white/20 overflow-hidden">
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
            <div className="p-6 pt-0 space-y-4">
              {videoData.characters.map((character: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Character {index + 1}</h3>
                    <button
                      onClick={() => removeCharacter(index)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                      <input
                        type="text"
                        value={character.name}
                        onChange={(e) => updateNestedField(`characters[${index}].name`, e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Image Prompt</label>
                      <textarea
                        value={character.imagePrompt}
                        onChange={(e) => updateNestedField(`characters[${index}].imagePrompt`, e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      />
                      {character.imageUrl ? (
                        <div>
                          <Image src={character.imageUrl || ''}
                            alt={character.imageStorageId}
                            width={500}
                            height={500}
                            unoptimized
                            className='w-full h-[250px] object-contain rounded-lg'
                          />
                          <div className='flex justify-between items-center mt-2'>
                            <div className='flex items-center gap-2'>
                              <Link href={character.imageUrl || ''} target='_blank'>
                                <Button variant={'ghost'}>View</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => generateCharacterImage({
                            index: index,
                            prompt: character.imagePrompt,
                          })}
                          className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors border border-purple-500/30"
                        >
                          {generatingCharacter === index ? 'Generating...' : 'Generate Image'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addCharacter}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors border border-purple-500/30"
              >
                <Plus className="w-5 h-5" />
                Add Character
              </button>
            </div>
          )}
        </div>

        {/* Scenes */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl mb-6 border border-white/20 overflow-hidden">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors border border-green-500/30"
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
                            <label className="block text-sm font-medium text-purple-200 mb-2">Scene Image Prompt</label>
                            <textarea
                              value={scene.imagePrompt}
                              onChange={(e) => updateNestedField(`scenes[${sceneIndex}].imagePrompt`, e.target.value)}
                              rows={4}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                            />
                          </div>

                          {/* Angles */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-purple-300">Angles ({scene.angles.length})</h4>

                            {/* Add Angle at Start Button */}
                            <button
                              onClick={() => addAngle(sceneIndex, 'start')}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500/10 text-green-300 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20 text-sm"
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
                                  className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 bg-blue-500/10 text-blue-300 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20 text-sm"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                  >
                    <ArrowDown className="w-5 h-5" />
                    Add Scene After
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoEditorComponent;
