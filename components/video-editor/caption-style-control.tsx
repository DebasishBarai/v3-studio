'use client'

import { captionStyleSchema } from "@/convex/schema";
import { Infer } from "convex/values";
import { useState } from "react";

type CaptionStyle = Infer<typeof captionStyleSchema>

const defaultCaptionStyle: Infer<typeof captionStyleSchema> = {
  textColor: "#ffffff",          // white
  backgroundColor: "#000000",    // black background
  backgroundOpacity: 0.35,       // matches rgba(0,0,0,0.35)
  textSize: "2.5rem",            // matches your fontSize
  position: "bottom",            // pushed to bottom
  showBackground: true,          // background is visible
  textAlign: "center",           // centered caption text
};


export const CaptionStyleControls = ({
  value = defaultCaptionStyle,
  updateCaptionStyleAction
}: {
  value?: CaptionStyle;
  updateCaptionStyleAction: (v: CaptionStyle) => void;
}) => {

  const [isOpen, setIsOpen] = useState(false);

  const update = (field: keyof CaptionStyle, val: any) => {
    updateCaptionStyleAction({ ...value, [field]: val });
  };

  return (
    <div>
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
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile: Vertical Stack */}
          <div className="lg:hidden space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90">Text Color</label>
              <input
                type="color"
                value={value.textColor}
                onChange={(e) => update("textColor", e.target.value)}
                className="w-14 h-9 rounded border border-white/20 cursor-pointer bg-black/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90">Background Color</label>
              <input
                type="color"
                value={value.backgroundColor}
                onChange={(e) => update("backgroundColor", e.target.value)}
                className="w-14 h-9 rounded border border-white/20 cursor-pointer bg-black/20"
              />
            </div>

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
              </select>
            </div>

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

            {/* <div className="flex items-center justify-between"> */}
            {/*   <label className="text-sm font-medium text-white/90">Text Align</label> */}
            {/*   <select */}
            {/*     value={value.textAlign ?? "center"} */}
            {/*     onChange={(e) => update("textAlign", e.target.value)} */}
            {/*     className="border border-white/20 rounded-md px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white" */}
            {/*   > */}
            {/*     <option value="left">Left</option> */}
            {/*     <option value="center">Center</option> */}
            {/*     <option value="right">Right</option> */}
            {/*   </select> */}
            {/* </div> */}

            <div className="flex items-center justify-between pt-1">
              <label className="text-sm font-medium text-white/90">Show Background</label>
              <input
                type="checkbox"
                checked={value.showBackground}
                onChange={(e) => update("showBackground", e.target.checked)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/10 border-white/20"
              />
            </div>
          </div>

          {/* Desktop: Horizontal Line */}
          <div className="hidden lg:grid lg:grid-cols-7 lg:gap-4 lg:items-center">
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

            {/* Text Align */}
            {/* <div className="flex flex-col gap-1"> */}
            {/*   <label className="text-xs font-medium text-white/90">Align</label> */}
            {/*   <select */}
            {/*     value={value.textAlign ?? "center"} */}
            {/*     onChange={(e) => update("textAlign", e.target.value)} */}
            {/*     className="border border-white/20 rounded-md px-2 py-1.5 text-xs bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white" */}
            {/*   > */}
            {/*     <option value="left">Left</option> */}
            {/*     <option value="center">Center</option> */}
            {/*     <option value="right">Right</option> */}
            {/*   </select> */}
            {/* </div> */}

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
          </div>
        </div>
      )}
    </div>
  );
};
