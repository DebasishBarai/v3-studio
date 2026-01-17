"use client";

import { Button } from "@/components/ui/button";
import {
  Heart,
  Baby,
  PawPrint,
  Sparkles,
  Play,
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

type Template = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  examplePrompt: string;
  trending?: boolean;
};

const templates: Template[] = [
  {
    id: "human-rescuing-animals",
    title: "Human Rescuing Animals",
    description: "Heartwarming stories of humans saving animals in distress. Perfect for emotional, viral content that touches hearts.",
    icon: <Heart className="h-8 w-8 text-red-400" />,
    category: "Rescue Stories",
    examplePrompt: "A kind person rescues a scared puppy from a storm drain, nurturing it back to health with love and care.",
    trending: true,
  },
  {
    id: "animal-asking-help",
    title: "Animals Seeking Help",
    description: "Touching tales of animals approaching humans for help to save their babies or partners. Emotional storytelling at its best.",
    icon: <PawPrint className="h-8 w-8 text-amber-400" />,
    category: "Animal Stories",
    examplePrompt: "A mother cat leads a stranger to her trapped kittens, meowing desperately for help to free her babies.",
    trending: true,
  },
  {
    id: "animal-saving-humans",
    title: "Animals Saving Humans",
    description: "Incredible stories of brave animals protecting and saving human babies or adults. Shows the beautiful bond between species.",
    icon: <Baby className="h-8 w-8 text-blue-400" />,
    category: "Hero Animals",
    examplePrompt: "A loyal dog protects a toddler from danger, barking to alert the parents and staying by the child's side.",
  },
  {
    id: "animal-friendship",
    title: "Unlikely Animal Friends",
    description: "Adorable stories of unexpected friendships between different animal species. Wholesome content that spreads joy.",
    icon: <Sparkles className="h-8 w-8 text-purple-400" />,
    category: "Friendship",
    examplePrompt: "A gentle golden retriever becomes best friends with an orphaned kitten, caring for it like its own baby.",
  },
  {
    id: "lost-pet-reunion",
    title: "Lost Pet Reunions",
    description: "Emotional reunion stories of pets finding their way back home or being reunited with their owners after years.",
    icon: <Heart className="h-8 w-8 text-pink-400" />,
    category: "Reunion Stories",
    examplePrompt: "After 3 years of searching, a family finally reunites with their lost dog at an animal shelter, tears of joy flowing.",
  },
  {
    id: "stray-transformation",
    title: "Stray Transformations",
    description: "Before and after stories of stray animals being rescued, rehabilitated, and transformed with love and care.",
    icon: <Sparkles className="h-8 w-8 text-green-400" />,
    category: "Transformation",
    examplePrompt: "A matted, scared stray dog is rescued from the streets and transformed into a healthy, happy pet with a loving family.",
  },
];

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="group relative bg-gradient-to-br from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      {template.trending && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          <TrendingUp className="h-3 w-3" />
          Trending
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
          {template.icon}
        </div>
        <div className="flex-1">
          <span className="text-xs text-gray-400 uppercase tracking-wider">{template.category}</span>
          <h3 className="text-lg font-semibold text-white mt-1">{template.title}</h3>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {template.description}
      </p>

      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Example prompt:</p>
        <p className="text-sm text-gray-300 italic line-clamp-2">&quot;{template.examplePrompt}&quot;</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Clock className="h-3 w-3" />
          <span>9:16 Shorts</span>
        </div>
        <Link href={`/ai-tools/ai-video?template=${template.id}`}>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white gap-2"
          >
            <Play className="h-4 w-4" />
            Use Template
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="max-w-full mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="p-6 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl shadow-md border border-white/10">
          <h1 className="font-bold text-3xl text-white flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            Video Templates
          </h1>
          <p className="text-gray-300 mt-3 leading-relaxed max-w-2xl">
            Choose from our curated collection of viral video templates. Each template is optimized for
            short-form content (9:16) and designed to create engaging, emotional stories that resonate with audiences.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              All templates are 9:16 aspect ratio
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Optimized for TikTok, Reels & Shorts
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-[#2D2F36] via-[#202227] to-[#1B1C20] rounded-xl border border-white/10 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">More Templates Coming Soon</h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          We&apos;re constantly adding new viral video templates. Have a suggestion?
          Let us know what kind of content you&apos;d like to create!
        </p>
        <Link href="/contact-us">
          <Button variant="outline" className="mt-4 border-white/20 hover:bg-white/10">
            Suggest a Template
          </Button>
        </Link>
      </div>
    </div>
  );
}
