'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, BrainCircuit, ShieldCheck, Layout } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-background overflow-x-hidden">
      {/* Navigation - Ultra Minimal Veridian */}
      <nav className="fixed top-0 left-0 w-full z-50 h-20 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary flex items-center justify-center transition-transform group-hover:rotate-90 duration-500">
               <BrainCircuit className="w-6 h-6 text-background" />
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter uppercase">COGNITIO</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-12">
            {['Architecture', 'Methodology', 'Manifesto'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-primary transition-colors cursor-pointer">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="text-[10px] uppercase font-black tracking-widest hover:text-primary transition-colors cursor-pointer"
            >
              Login
            </button>
            <Button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="bg-primary text-background border-none text-[10px] uppercase font-black tracking-[0.3em] px-10 h-12 hover:bg-accent transition-all rounded-none cursor-pointer"
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section - Asymmetric Veridian */}
        <section className="relative pt-48 pb-32 px-12 border-b border-white/5">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-24 items-start">
              <div className="space-y-16">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural System v5.0</span>
                  </div>
                  <h1 className="font-heading text-8xl md:text-[12rem] font-black leading-[0.75] tracking-tighter uppercase">
                    Atomic<br />
                    <span className="text-primary italic">Insight.</span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl text-foreground/70 font-medium leading-tight max-w-2xl border-l-2 border-primary/20 pl-8"
                >
                  Cognitio decomposes complex subjects into atomic study units, optimized for long-term memory consolidation via neural-pattern analysis.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-8 pt-8"
                >
                  <Button 
                    size="lg" 
                    onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                    className="bg-foreground text-background font-heading text-[11px] uppercase tracking-[0.4em] font-black rounded-none h-20 px-16 hover:bg-primary transition-all w-full sm:w-auto cursor-pointer"
                  >
                    Initialize Setup
                    <ArrowRight className="ml-6 w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-8 px-4">
                     <div className="flex -space-x-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-12 h-12 border-2 border-background bg-secondary flex items-center justify-center font-black text-[12px] text-primary">
                            0{i}
                          </div>
                        ))}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Collective Intelligence</span>
                        <span className="text-lg font-black tabular-nums">12,842 NODES</span>
                     </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="hidden lg:block"
              >
                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Neural Latency', val: '14ms', progress: 92 },
                      { label: 'Retention Accuracy', val: '99.8%', progress: 98 },
                      { label: 'Cognitive Compression', val: '8X', progress: 85 }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 p-10 space-y-6 hover:border-primary/50 transition-colors group">
                         <div className="flex justify-between items-end">
                            <div className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em] group-hover:text-primary transition-colors">{stat.label}</div>
                            <div className="text-4xl font-heading font-black tabular-nums">{stat.val}</div>
                         </div>
                         <div className="h-px bg-white/10 w-full relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.progress}%` }}
                              transition={{ delay: 0.8 + (i * 0.1), duration: 1 }}
                              className="absolute top-0 left-0 h-full bg-primary" 
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Methodology Section - Veridian Depth */}
        <section className="py-48 px-12 bg-secondary/20 relative" id="methodology">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.05),transparent)] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-16 mb-32">
              <div className="space-y-6">
                <h2 className="font-heading text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">The Framework.</h2>
                <div className="flex items-center gap-6">
                   <div className="h-px w-24 bg-primary" />
                   <p className="text-primary text-[10px] font-black tracking-[0.5em] uppercase">Built for high-performance cognitive growth</p>
                </div>
              </div>
              <span className="text-[12rem] font-black text-white/5 tracking-tighter uppercase hidden xl:block font-heading leading-none">SYSTEM</span>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
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
                <div key={i} className="bg-background p-20 space-y-12 premium-lift group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-0 bg-primary transition-all duration-500 group-hover:h-full" />
                  <div className="w-20 h-20 bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                    <feature.icon className="w-10 h-10 text-primary group-hover:text-background transition-colors" />
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-heading text-3xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-foreground/40 text-[11px] leading-relaxed font-bold uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - High Contrast Veridian */}
        <section className="py-64 px-12 border-y border-white/5 relative overflow-hidden bg-[#022c22]">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center relative z-10 space-y-20"
          >
            <h2 className="font-heading text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
              Reconstruct Your<br />
              <span className="text-primary italic">Intelligence.</span>
            </h2>
            <div className="flex flex-col items-center gap-12">
              <Button 
                size="lg" 
                onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                className="bg-primary text-background border-none h-24 px-24 text-[12px] uppercase font-black tracking-[0.5em] hover:bg-white hover:scale-105 transition-all rounded-none cursor-pointer"
              >
                Access System v5.0
              </Button>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Zero latency deployment into your neural workflow.</p>
            </div>
          </motion.div>
          
          <div className="absolute bottom-0 right-0 p-12 hidden lg:block">
             <BrainCircuit className="w-32 h-32 text-white/5" />
          </div>
        </section>
      </main>

      {/* Footer - Minimalist Veridian */}
      <footer className="py-32 px-12 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                 <BrainCircuit className="w-5 h-5 text-background" />
              </div>
              <span className="font-heading font-black text-xl tracking-tighter uppercase">COGNITIO</span>
            </Link>
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] max-w-xs leading-relaxed">
              Designed for high-performance cognitive growth. Neural rights reserved. MMXVI.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-32">
            {['SYSTEM', 'SUPPORT', 'LEGAL'].map(col => (
               <div key={col} className="space-y-8">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">{col}</h4>
                 <ul className="space-y-4">
                   {['Changelog', 'Status', 'API', 'Legal', 'Privacy'].slice(0, 3).map(item => (
                     <li key={item} className="text-[10px] font-black uppercase tracking-widest text-foreground/50 hover:text-primary cursor-pointer transition-colors">{item}</li>
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
