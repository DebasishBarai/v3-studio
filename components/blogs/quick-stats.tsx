'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Video,
  DollarSign,
  Users,
} from 'lucide-react';

const ICONS = {
  trending: TrendingUp,
  video: Video,
  dollar: DollarSign,
  users: Users,
};

interface StatProps {
  icon: keyof typeof ICONS;
  label: string;
  value: string;
}

interface QuickStatsProps {
  stats: StatProps[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="grid md:grid-cols-4 gap-4 mb-12"
    >
      {stats.map((stat, i) => {
        const Icon = ICONS[stat.icon];

        return (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all">
              <Icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">
                {stat.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

