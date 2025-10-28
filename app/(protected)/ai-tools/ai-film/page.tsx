'use client'

import { RadioSet, RadioSetItem } from "@/components/radio-set";
import { MonitorPlay, Smartphone } from "lucide-react";
import { useState } from "react";

export default function AIFilmPage() {
  const [selectedValue, setSelectedValue] = useState<string>('16:9');
  const aspectRatioItems: RadioSetItem[] = [
    { icon: MonitorPlay, value: '16:9' },
    { icon: Smartphone, value: '9:16' },
  ];
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      Ai film page
      <RadioSet
        items={aspectRatioItems}
        defaultValue="16:9"
        onValueChange={setSelectedValue}
      />
    </div>
  )
}
