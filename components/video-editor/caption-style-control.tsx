'use client'

import { captionStyleSchema, CAPTION_PRESETS } from "@/convex/schema";
import { Infer } from "convex/values";
import { useState, useEffect, useRef } from "react";

type CaptionStyle = Infer<typeof captionStyleSchema>

const defaultCaptionStyle: Infer<typeof captionStyleSchema> = {
  textColor: "#ffffff",
  backgroundColor: "#000000",
  backgroundOpacity: 0.35,
  textSize: "2.5rem",
  position: "bottom",
  showBackground: true,
  textAlign: "center",
  fontFamily: "Komika",
};

const presetLabels = {
  tiktok: "🎵 TikTok",
  youtubeShorts: "▶️ YouTube Shorts",
  instagramReels: "📸 Instagram Reels",
  classic: "📺 Classic",
  minimal: "⚪ Minimal",
};

const FONT_FAMILIES = [
  "Pacifico",
  "Bangers",
  "Komika",
  "Coiny",
];

export const CaptionStyleControls = ({
  value = defaultCaptionStyle,
  updateCaptionStyleAction
}: {
  value?: CaptionStyle;
  updateCaptionStyleAction: (v: CaptionStyle) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [isModified, setIsModified] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect which preset matches current style (if any)
  useEffect(() => {
    const matchingPreset = Object.entries(CAPTION_PRESETS).find(([_, preset]) => {
      return JSON.stringify(preset) === JSON.stringify(value);
    });

    if (matchingPreset) {
      setSelectedPreset(matchingPreset[0]);
      setIsModified(false);
    } else {
      setIsModified(true);
    }
  }, [value]);

  const applyPreset = (presetName: string) => {
    if (presetName === 'custom') return;

    const preset = CAPTION_PRESETS[presetName as keyof typeof CAPTION_PRESETS];
    if (preset) {
      setSelectedPreset(presetName);
      setIsModified(false);
      updateCaptionStyleAction(preset);
      setDropdownOpen(false);
    }
  };

  const update = (field: keyof CaptionStyle, val: any) => {
    setIsModified(true);
    updateCaptionStyleAction({ ...value, [field]: val });
  };

  const resetToPreset = () => {
    if (selectedPreset !== 'custom') {
      const preset = CAPTION_PRESETS[selectedPreset as keyof typeof CAPTION_PRESETS];
      if (preset) {
        setIsModified(false);
        updateCaptionStyleAction(preset);
      }
    }
  };

  // Helper to get caption style CSS for dropdown items
  const getPresetStyle = (presetKey: string) => {
    const preset = CAPTION_PRESETS[presetKey as keyof typeof CAPTION_PRESETS];
    if (!preset) return {};

    let advancedStyle = {};
    if (preset.advancedStyle) {
      try {
        advancedStyle = JSON.parse(preset.advancedStyle);
      } catch (e) {
        console.error('Failed to parse advanced style:', e);
      }
    }

    return {
      color: preset.textColor,
      backgroundColor: preset.showBackground
        ? `${preset.backgroundColor}${Math.round(preset.backgroundOpacity * 255).toString(16).padStart(2, '0')}`
        : 'transparent',
      fontSize: '0.875rem', // Scaled down for dropdown
      fontWeight: preset.fontWeight || '600',
      textTransform: preset.textTransform || 'none',
      textAlign: preset.textAlign || 'center',
      padding: preset.showBackground ? '8px 12px' : '4px 12px',
      borderRadius: preset.showBackground ? '6px' : '0',
      fontFamily: preset.fontFamily || 'Komika',
      ...advancedStyle,
    } as React.CSSProperties;
  };

  return (
    <div className="flex flex-col items-center md:items-start gap-2 max-h-[80svh] overflow-y-auto">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium text-sm transition-all duration-200 backdrop-blur-sm flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        Caption Style
        {isModified && (
          <span className="w-2 h-2 bg-yellow-400 rounded-full" title="Modified from preset"></span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Controls Panel */}
      {isOpen && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">

          {/* Step 1: Preset Selection with Custom Dropdown */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/90">
                Choose Preset Style
              </label>
              {isModified && selectedPreset !== 'custom' && (
                <button
                  onClick={resetToPreset}
                  className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded border border-blue-500/30 transition-all"
                >
                  Reset to {selectedPreset}
                </button>
              )}
            </div>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {presetLabels[selectedPreset as keyof typeof presetLabels] || 'Custom'}
                  {isModified && (
                    <span className="text-xs text-yellow-300">(Modified)</span>
                  )}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                  {Object.entries(presetLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-all border-b border-white/5 last:border-b-0 flex items-center justify-center"
                    >
                      <span style={getPresetStyle(key)}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isModified && (
              <div className="mt-2 text-xs text-yellow-300 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Custom modifications applied
              </div>
            )}
          </div>

          {/* Step 2: Customization Controls */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <label className="text-sm font-medium text-white/90 mb-3 block">
              Customize Settings
            </label>

            {/* Mobile: Vertical Stack */}
            <div className="lg:hidden space-y-4">

              {/* Text Color */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">Text Color</label>
                <input
                  type="color"
                  value={value.textColor}
                  onChange={(e) => update("textColor", e.target.value)}
                  className="w-14 h-9 rounded border border-white/20 cursor-pointer bg-black/20"
                />
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">Background Color</label>
                <input
                  type="color"
                  value={value.backgroundColor}
                  onChange={(e) => update("backgroundColor", e.target.value)}
                  className="w-14 h-9 rounded border border-white/20 cursor-pointer bg-black/20"
                />
              </div>

              {/* Background Opacity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 block">
                  Background Opacity: {value.backgroundOpacity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={value.backgroundOpacity}
                  onChange={(e) => update("backgroundOpacity", Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Text Size */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">Text Size</label>
                <select
                  value={value.textSize}
                  onChange={(e) => update("textSize", e.target.value)}
                  className="border border-white/20 rounded-md px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="1.5rem">1.5</option>
                  <option value="2rem">2</option>
                  <option value="2.5rem">2.5</option>
                  <option value="3rem">3</option>
                  <option value="3.5rem">3.5</option>
                  <option value="4rem">4</option>
                  <option value="4.5rem">4.5</option>
                  <option value="5rem">5</option>
                </select>
              </div>

              {/* Position */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">Position</label>
                <select
                  value={value.position}
                  onChange={(e) => update("position", e.target.value)}
                  className="border border-white/20 rounded-md px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              {/* Font Family */}
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm font-medium text-white/90">
                  Font Family
                </label>

                <select
                  value={value.fontFamily ?? "Komika"}
                  onChange={(e) =>
                    update("fontFamily", e.target.value as CaptionStyle["fontFamily"])
                  }
                  className="w-44 text-center border border-white/20 rounded-md
               px-3 py-2 text-sm bg-white/10 text-white
               focus:outline-none focus:ring-2 focus:ring-blue-500
               cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Words per batch */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">Words</label>
                <select
                  value={value.wordsPerBatch}
                  onChange={(e) => update("wordsPerBatch", Number(e.target.value))}
                  className="border border-white/20 rounded-md px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Text Transform */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">
                  Text Transform
                </label>
                <select
                  value={value.textTransform ?? "none"}
                  onChange={(e) =>
                    update("textTransform", e.target.value as CaptionStyle["textTransform"])
                  }
                  className="border border-white/20 rounded-md px-3 py-2 text-sm
               bg-white/10 text-white focus:outline-none
               focus:ring-2 focus:ring-blue-500 cursor-pointer
               [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>

              {/* Show Background */}
              <div className="flex items-center justify-between pt-1">
                <label className="text-sm font-medium text-white/90">Show Background</label>
                <input
                  type="checkbox"
                  checked={value.showBackground}
                  onChange={(e) => update("showBackground", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/10 border-white/20"
                />
              </div>

              {/* Show Caption */}
              <div className="flex items-center justify-between pt-1">
                <label className="text-sm font-medium text-white/90">Show Caption</label>
                <input
                  type="checkbox"
                  checked={value?.showCaption}
                  onChange={(e) => update("showCaption", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/10 border-white/20"
                />
              </div>

            </div>

            {/* Desktop: Horizontal Grid */}
            <div className="hidden lg:grid lg:grid-cols-6 lg:gap-4 lg:items-center">

              {/* Text Color */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">Text Color</label>
                <input
                  type="color"
                  value={value.textColor}
                  onChange={(e) => update("textColor", e.target.value)}
                  className="w-full h-8 rounded border border-white/20 cursor-pointer bg-black/20"
                />
              </div>

              {/* Background Color */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">BG Color</label>
                <input
                  type="color"
                  value={value.backgroundColor}
                  onChange={(e) => update("backgroundColor", e.target.value)}
                  className="w-full h-8 rounded border border-white/20 cursor-pointer bg-black/20"
                />
              </div>

              {/* Background Opacity */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">
                  Opacity: {value.backgroundOpacity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={value.backgroundOpacity}
                  onChange={(e) => update("backgroundOpacity", Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Text Size */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">Size</label>
                <select
                  value={value.textSize}
                  onChange={(e) => update("textSize", e.target.value)}
                  className="border border-white/20 rounded-md px-2 py-1.5 text-xs bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="1.5rem">1.5</option>
                  <option value="2rem">2</option>
                  <option value="2.5rem">2.5</option>
                  <option value="3rem">3</option>
                  <option value="3.5rem">3.5</option>
                  <option value="4rem">4</option>
                  <option value="4.5rem">4.5</option>
                  <option value="5rem">5</option>
                </select>
              </div>

              {/* Position */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">Position</label>
                <select
                  value={value.position}
                  onChange={(e) => update("position", e.target.value)}
                  className="border border-white/20 rounded-md px-2 py-1.5 text-xs bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              {/* Font Family */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">
                  Font
                </label>

                <select
                  value={value.fontFamily ?? "Komika"}
                  onChange={(e) =>
                    update("fontFamily", e.target.value)
                  }
                  className="border border-white/20 rounded-md px-2 py-1.5 text-xs
               bg-white/10 text-white focus:outline-none
               focus:ring-2 focus:ring-blue-500 cursor-pointer
               [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Words per batch */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">Words</label>
                <select
                  value={value.wordsPerBatch}
                  onChange={(e) => update("wordsPerBatch", Number(e.target.value))}
                  className="border border-white/20 rounded-md px-2 py-1.5 text-xs bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Text Transform */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-white/90">
                  Transform
                </label>
                <select
                  value={value.textTransform ?? "none"}
                  onChange={(e) =>
                    update("textTransform", e.target.value as CaptionStyle["textTransform"])
                  }
                  className="border border-white/20 rounded-md px-2 py-1.5 text-xs
               bg-white/10 text-white focus:outline-none
               focus:ring-2 focus:ring-blue-500 cursor-pointer
               [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPER</option>
                  <option value="lowercase">lower</option>
                  <option value="capitalize">Cap</option>
                </select>
              </div>

              {/* Show Background */}
              <div className="flex flex-col gap-1 items-center">
                <label className="text-xs font-medium text-white/90">Show BG</label>
                <input
                  type="checkbox"
                  checked={value.showBackground}
                  onChange={(e) => update("showBackground", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/10 border-white/20"
                />
              </div>

              {/* Show Caption */}
              <div className="flex flex-col gap-1 items-center">
                <label className="text-xs font-medium text-white/90">Show Caption</label>
                <input
                  type="checkbox"
                  checked={value.showCaption}
                  onChange={(e) => update("showCaption", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/10 border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
