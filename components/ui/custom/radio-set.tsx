'use client';

import { useState } from 'react';
import { MonitorPlay, Smartphone, LucideIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export interface RadioSetItem {
  icon: LucideIcon;
  value: string;
  label?: string;
}

interface RadioSetProps {
  items: RadioSetItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const RadioSet = ({ items, defaultValue, onValueChange, className = '' }: RadioSetProps) => {
  const [selected, setSelected] = useState<string>(defaultValue || items[0]?.value || '');

  const handleChange = (value: string) => {
    setSelected(value);
    onValueChange?.(value);
  };

  return (
    <RadioGroup
      value={selected}
      onValueChange={handleChange}
      className={`w-fit flex items-center justify-center gap-1 bg-zinc-900 border border-zinc-800 rounded p-1 ${className}`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.value}
            type="button"
            variant={selected === item.value ? 'secondary' : 'ghost'}
            size="sm"
            className={`relative h-9 min-w-9 px-4 py-2 ${selected === item.value
              ? 'bg-zinc-800 text-white'
              : 'text-white hover:bg-zinc-800'
              }`}
            onClick={() => handleChange(item.value)}
          >
            <RadioGroupItem value={item.value} className="sr-only" />
            <Icon className="mr-1 w-4 h-4" />
            {item.label || item.value}
          </Button>
        );
      })}
    </RadioGroup>
  );
}

