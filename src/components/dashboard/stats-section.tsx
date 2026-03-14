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
      className="space-y-12"
    >
      {/* Metric Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Total Sets', value: stats.totalSets, icon: Layers, color: 'text-blue-500', detail: 'Knowledge Hubs' },
          { label: 'Total Nodes', value: stats.totalFlashcards, icon: PlaySquare, color: 'text-purple-500', detail: 'Flashcards' },
          { label: 'Due Today', value: stats.dueToday, icon: CalendarClock, color: 'text-pink-500', detail: 'Pending Review' },
          { label: 'New Intake', value: stats.newCards, icon: BrainCircuit, color: 'text-cyan-500', detail: 'Unseen Data' },
          { label: 'Activity', value: stats.totalReviewed, icon: Activity, color: 'text-emerald-500', detail: 'Total Sessions' },
          { label: 'Mastered', value: stats.masteredCards, icon: Trophy, color: 'text-amber-500', detail: 'Consolidated' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="glass group hover:border-white/10 transition-all duration-500 rounded-3xl overflow-hidden relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <Sparkles className="w-3 h-3 text-white/5 group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-white tracking-tighter tabular-nums">{stat.value}</div>
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
                <div className="mt-4 text-[9px] font-medium text-white/10 uppercase tracking-widest">{stat.detail}</div>
              </CardContent>
              {/* Decorative glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-primary/5 transition-colors" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Visual Analytics */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Forecast Visualization */}
        <motion.div variants={item}>
          <Card className="glass rounded-[2.5rem] p-8 border-white/[0.04]">
             <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-1">Retention Forecast</h3>
                  <p className="text-xs text-white/30 font-medium">14-Day predicted workload analysis</p>
               </div>
               <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                 Active Engine
               </div>
             </div>
             
             <div className="h-[350px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={forecastData}>
                   <defs>
                     <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor="#3b82f6" />
                       <stop offset="100%" stopColor="#8b5cf6" />
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                   <XAxis
                     dataKey="date"
                     stroke="rgba(255,255,255,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     dy={15}
                     fontFamily="var(--font-mono)"
                   />
                   <YAxis
                     stroke="rgba(255,255,255,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     tickFormatter={(value: any) => `${value}`}
                     fontFamily="var(--font-mono)"
                   />
                   <Tooltip
                     contentStyle={{ 
                        backgroundColor: '#0a0a0a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)'
                     }}
                     itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                     labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                   />
                   <Line
                     type="monotone"
                     dataKey="count"
                     name="Reviews"
                     stroke="url(#lineGradient)"
                     strokeWidth={4}
                     dot={false}
                     activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }}
                     animationDuration={2000}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </Card>
        </motion.div>

        {/* Distribution Visualization */}
        <motion.div variants={item}>
          <Card className="glass rounded-[2.5rem] p-8 border-white/[0.04]">
             <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-1">Memory Matrix</h3>
                  <p className="text-xs text-white/30 font-medium">Distribution of cognitive retention layers</p>
               </div>
               <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-500">
                 Stable
               </div>
             </div>
             
             <div className="h-[350px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={retentionData} margin={{ left: -20, right: 10 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                   <XAxis
                     dataKey="name"
                     stroke="rgba(255,255,255,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     dy={15}
                     fontFamily="var(--font-mono)"
                   />
                   <YAxis
                     stroke="rgba(255,255,255,0.2)"
                     fontSize={10}
                     tickLine={false}
                     axisLine={false}
                     tickFormatter={(value: any) => `${value}`}
                     fontFamily="var(--font-mono)"
                   />
                   <Tooltip
                     cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                     contentStyle={{ 
                        backgroundColor: '#0a0a0a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)'
                     }}
                     itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                   />
                   <Bar
                     dataKey="value"
                     name="Cards"
                     radius={[8, 8, 0, 0]}
                     animationDuration={1500}
                   >
                     {retentionData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${0.4 + (index * 0.2)})`} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
