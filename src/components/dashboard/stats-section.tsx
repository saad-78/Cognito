'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Cell } from 'recharts';
import { BrainCircuit, Layers, PlaySquare, CalendarClock, Trophy, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
      className="space-y-20 px-12"
    >
      {/* Metric Grid - High Contrast */}
      <div className="grid gap-px bg-border border border-border md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Total Sets', value: stats.totalSets, icon: Layers, detail: 'Hubs' },
          { label: 'Total Nodes', value: stats.totalFlashcards, icon: PlaySquare, detail: 'Cards' },
          { label: 'Due Today', value: stats.dueToday, icon: CalendarClock, detail: 'Pending' },
          { label: 'New Intake', value: stats.newCards, icon: BrainCircuit, detail: 'Unseen' },
          { label: 'Activity', value: stats.totalReviewed, icon: Activity, detail: 'Sessions' },
          { label: 'Mastered', value: stats.masteredCards, icon: Trophy, detail: 'Finalized' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <div className="bg-background p-10 space-y-6 hover:bg-secondary transition-colors group">
              <div className="flex items-center justify-between">
                <stat.icon className="w-6 h-6 text-foreground/20 group-hover:text-foreground transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-black text-foreground tracking-tighter tabular-nums">{stat.value}</div>
                <div className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
              <div className="text-[10px] font-bold text-foreground/10 uppercase tracking-widest">{stat.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Analytics - Strict Layout */}
      <div className="grid gap-px bg-border border border-border lg:grid-cols-2">
        {/* Forecast Visualization */}
        <motion.div variants={item}>
          <div className="bg-background p-12 h-full">
             <div className="flex items-center justify-between mb-16">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">RETENTION FORECAST</h3>
                  <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest">14-Day Workload Prediction</p>
               </div>
             </div>
             
             <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={forecastData}>
                   <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.05)" />
                   <XAxis
                     dataKey="date"
                     stroke="rgba(0,0,0,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     dy={15}
                     fontFamily="var(--font-mono)"
                     fontWeight="bold"
                   />
                   <YAxis
                     stroke="rgba(0,0,0,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     fontFamily="var(--font-mono)"
                     fontWeight="bold"
                   />
                   <Tooltip
                     cursor={{ stroke: '#000', strokeWidth: 1 }}
                     contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #000',
                        borderRadius: '0px',
                        padding: '12px'
                     }}
                     itemStyle={{ color: '#000', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                     labelStyle={{ color: '#000', fontSize: '10px', fontWeight: '900', marginBottom: '8px', borderBottom: '1px solid #000', paddingBottom: '4px' }}
                   />
                   <Line
                     type="stepAfter"
                     dataKey="count"
                     name="REVIEWS"
                     stroke="#000"
                     strokeWidth={3}
                     dot={{ r: 0 }}
                     activeDot={{ r: 4, fill: '#000', strokeWidth: 0 }}
                     animationDuration={1500}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>
        </motion.div>

        {/* Distribution Visualization */}
        <motion.div variants={item}>
          <div className="bg-background p-12 h-full">
             <div className="flex items-center justify-between mb-16">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">MEMORY MATRIX</h3>
                  <p className="text-xs text-foreground/30 font-bold uppercase tracking-widest">Cognitive Layer Saturation</p>
               </div>
             </div>
             
             <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={retentionData}>
                   <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(0,0,0,0.05)" />
                   <XAxis
                     dataKey="name"
                     stroke="rgba(0,0,0,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     dy={15}
                     fontFamily="var(--font-mono)"
                     fontWeight="bold"
                   />
                   <YAxis
                     stroke="rgba(0,0,0,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     fontFamily="var(--font-mono)"
                     fontWeight="bold"
                   />
                   <Tooltip
                     cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                     contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #000',
                        borderRadius: '0px',
                        padding: '12px'
                     }}
                     itemStyle={{ color: '#000', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                   />
                   <Bar
                     dataKey="value"
                     name="CARDS"
                     radius={0}
                     animationDuration={1500}
                   >
                     {retentionData.map((_entry, index) => (
                       <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#000' : '#e4e4e7'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
