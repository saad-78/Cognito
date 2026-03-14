'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { Brain, Sparkles, Zap, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsProps {
  stats: {
    totalSets: number;
    totalFlashcards: number;
    dueToday: number;
    newCards: number;
    totalReviewed: number;
    masteredCards: number;
  };
  forecastData?: { date: string; count: number }[];
  retentionData?: { name: string; value: number }[];
}

export function StatsSection({ stats, forecastData = [], retentionData = [] }: StatsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-16 px-12"
    >
      {/* Primary Metrics Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Nodes', value: stats.totalFlashcards, secondary: '+12% vs last week', icon: Brain },
          { label: 'Mastery Level', value: `${((stats.masteredCards / (stats.totalFlashcards || 1)) * 100).toFixed(0)}%`, secondary: 'Target: 95%', icon: Sparkles },
          { label: 'Memory Retention', value: 'High', secondary: 'Neural-Sync: Optimized', icon: Zap },
          { label: 'Active Sessions', value: stats.totalReviewed, secondary: 'Lvl 04 Intelligence', icon: TrendingUp }
        ].map((metric, i) => (
          <motion.div key={i} variants={item}>
            <Card className="premium-lift p-8 space-y-6 bg-background border border-border">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-secondary flex items-center justify-center">
                   <metric.icon className="w-5 h-5 text-foreground/40" />
                </div>
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{metric.secondary}</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">{metric.label}</h4>
                <div className="text-4xl font-black tracking-tighter tabular-nums">{metric.value}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytical Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="p-10 premium-lift space-y-10 bg-background border border-border h-full">
            <div className="flex items-end justify-between border-b border-border pb-8">
              <div className="space-y-2">
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Memory Consolidation</h3>
                 <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">Temporal Neural-Pattern Strength</p>
              </div>
              <div className="flex gap-4">
                 {['7D', '30D'].map(t => (
                   <button key={t} className="text-[10px] font-black px-4 py-2 bg-secondary hover:bg-foreground hover:text-white transition-all uppercase tracking-widest">{t}</button>
                 ))}
              </div>
            </div>

            <div className="h-[400px] w-full relative group">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={forecastData}>
                   <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.05)" />
                   <XAxis 
                     dataKey="date" 
                     hide={true}
                   />
                   <YAxis hide={true} />
                   <Tooltip
                     cursor={{ stroke: 'var(--accent)', strokeWidth: 2 }}
                     content={({ active, payload }: any) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-foreground text-background p-4 text-[10px] font-black uppercase tracking-widest border-2 border-accent">
                             {payload[0].payload.date}: {payload[0].value} REVIEWS
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Line 
                     type="stepAfter" 
                     dataKey="count" 
                     stroke="var(--accent)" 
                     strokeWidth={3} 
                     dot={false}
                     animationDuration={2000}
                   />
                 </LineChart>
               </ResponsiveContainer>
               <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-black text-foreground/20 uppercase tracking-widest pt-4 border-t border-border/50">
                  <span>START_PERIOD</span>
                  <span>NODE_PROJECTION_COMPLETE</span>
                  <span>END_PERIOD</span>
               </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-10 premium-lift space-y-10 bg-background border border-border h-full">
            <div className="border-b border-border pb-8 space-y-2">
               <h3 className="text-2xl font-black uppercase tracking-tighter">Node_Status</h3>
               <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">Intelligence Distribution</p>
            </div>

            <div className="space-y-8">
              {[
                { label: 'Active Memory', value: 65, color: 'bg-accent' },
                { label: 'Long-term Storage', value: 25, color: 'bg-foreground' },
                { label: 'Volatile Data', value: 10, color: 'bg-foreground/10' }
              ].map((node, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{node.label}</span>
                    <span className="text-foreground/40">{node.value}%</span>
                  </div>
                  <div className="h-4 bg-secondary border border-border overflow-hidden">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${node.value}%` }}
                       className={cn("h-full", node.color)}
                     />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-border mt-auto">
               <div className="p-6 bg-accent/5 border border-accent/10 space-y-4">
                  <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Insight Available</h4>
                  <p className="text-[10px] font-bold text-foreground/60 uppercase leading-relaxed tracking-tight">Your retention for "Quantum Physics" is dipping. Recommend immediate re-sync session.</p>
                  <Button className="w-full h-10 bg-accent text-white rounded-none text-[8px] font-black uppercase tracking-[0.4em]">Initialize Session</Button>
               </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
