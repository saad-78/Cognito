'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, BrainCircuit, ShieldCheck, Layout } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* Navigation - Floating Refined */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-5xl">
        <div className="glass px-8 h-16 flex items-center justify-between border border-border/50 shadow-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
               <BrainCircuit className="w-5 h-5 text-background" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">COGNITIO</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {['Architecture', 'Methodology', 'Manifesto'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="text-[10px] uppercase font-black tracking-widest px-6 hover:opacity-60 transition-opacity"
            >
              Login
            </button>
            <Button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="bg-accent text-white border-none text-[10px] uppercase font-black tracking-[0.2em] px-8 hover:bg-accent/90 transition-all rounded-none"
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-48 pb-32 px-12 border-b border-border">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-end">
            <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary border border-border">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-foreground">System v4.0 Active</span>
                </div>
                <h1 className="text-8xl md:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase">
                  Atomic<br />Insight.
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-foreground/60 font-medium leading-tight max-w-xl"
              >
                Cognitio decomposes complex subjects into atomic study units, optimized for long-term memory consolidation via neural-pattern analysis.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-6 pt-6"
              >
                <Button 
                  size="lg" 
                  onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                  className="bg-foreground text-background text-xs uppercase tracking-[0.3em] font-black rounded-none h-16 px-12 hover:bg-foreground/90 transition-all w-full sm:w-auto"
                >
                  Initialize Setup
                  <ArrowRight className="ml-4 w-4 h-4" />
                </Button>
                <div className="flex items-center gap-6 px-4">
                   <div className="flex -space-x-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 border-2 border-background bg-secondary flex items-center justify-center font-black text-[10px]">
                          0{i}
                        </div>
                      ))}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">12K+ ACTIVE NODES</span>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block shadow-2xl"
            >
               <div className="grid grid-cols-2 gap-px bg-border border border-border">
                  {[
                    { label: 'Latency', val: '14ms' },
                    { label: 'Precision', val: '99.8%' },
                    { label: 'Cognitive Load', val: 'Low' },
                    { label: 'Retention', val: '8X' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-background p-12 space-y-4">
                       <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">{stat.label}</div>
                       <div className="text-4xl font-black tabular-nums">{stat.val}</div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-32 px-12 bg-secondary/50" id="methodology">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">The Framework</h2>
                <p className="text-foreground/40 text-sm font-black tracking-[0.4em] uppercase">Built for high-performance cognitive growth</p>
              </div>
              <span className="text-8xl font-black text-foreground/5 tracking-tighter uppercase hidden lg:block font-sans">Architecture</span>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
              {[
                { 
                  title: 'Decomposition', 
                  desc: 'Complex topics are automatically fragmented into fundamental principles, ensuring zero cognitive friction.',
                  icon: Layout 
                },
                { 
                  title: 'Neural-PathSync', 
                  desc: 'Our algorithm utilizes optimized intervals adjusted to your individual forgetting curve.',
                  icon: Zap 
                },
                { 
                  title: 'Logic Mapping', 
                  desc: 'Synthesize data through structured reasoning rather than simple rote memorization.',
                  icon: Brain 
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background p-16 space-y-8 premium-lift group">
                  <div className="w-16 h-16 bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
                    <feature.icon className="w-8 h-8 text-foreground group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{feature.title}</h3>
                    <p className="text-foreground/40 text-[10px] leading-relaxed font-bold uppercase tracking-widest">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-48 px-12 border-y border-border bg-foreground text-background overflow-hidden relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative z-10 space-y-12"
          >
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              Reconstruct Your Intelligence
            </h2>
            <Button 
               size="lg" 
               onClick={() => signIn("google", { redirectTo: "/dashboard" })}
               className="bg-accent text-white border-none py-10 px-16 text-xs uppercase font-black tracking-[0.4em] hover:bg-accent/90 transition-all rounded-none"
            >
              Access System
            </Button>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-white/5 tracking-tighter uppercase whitespace-nowrap pointer-events-none">
            THINK BEYOND
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 px-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-foreground flex items-center justify-center">
                 <BrainCircuit className="w-4 h-4 text-background" />
              </div>
              <span className="font-black text-lg tracking-tighter uppercase">COGNITIO</span>
            </Link>
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] max-w-xs">
              Designed in Switzerland & San Francisco. All neural rights reserved. 2026.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-24">
            {['SYSTEM', 'SUPPORT', 'LEGAL'].map(col => (
               <div key={col} className="space-y-6">
                 <h4 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">{col}</h4>
                 <ul className="space-y-3">
                   {['Changelog', 'Status', 'API', 'Legal', 'Privacy'].slice(0, 3).map(item => (
                     <li key={item} className="text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground cursor-pointer transition-colors">{item}</li>
                   ))}
                 </ul>
               </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
