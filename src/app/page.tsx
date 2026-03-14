'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Brain, Check, TrendingUp, Star, BrainCircuit, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <BrainCircuit className="w-6 h-6 text-foreground group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl tracking-tighter">COGNITIO</span>
          </Link>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="text-sm font-bold tracking-tight hover:opacity-60 transition-opacity"
            >
              LOG IN
            </button>
            <Button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-8 h-12 text-xs font-black tracking-widest uppercase transition-all"
            >
              START FREE
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-60 pb-40 px-6">
        <div className="max-w-[1200px] mx-auto text-left">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] sm:text-[120px] lg:text-[180px] font-black tracking-[-0.06em] leading-[0.8] mb-16 uppercase"
          >
            STUDY <br />
            SMARTER.
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-20 items-end">
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl sm:text-3xl font-medium leading-tight tracking-tight text-foreground/60 max-w-xl"
              >
                Cognitio transforms complexity into clarity. AI-powered flashcards built for high-performance learning.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <Button 
                  size="lg" 
                  onClick={() => signIn("google", { redirectTo: "/dashboard" })}
                  className="h-16 px-12 text-sm font-black bg-foreground hover:bg-foreground/90 text-background rounded-none transition-all uppercase tracking-widest"
                >
                  Get started
                  <ArrowRight className="ml-4 w-5 h-5" />
                </Button>
                <span className="text-xs font-bold tracking-widest text-foreground/40 uppercase">
                  Trusted by 5,000+ Students
                </span>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Strict Minimalist */}
      <section className="px-6 py-40 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            {[
              { 
                title: "AI SYNTHESIS", 
                desc: "Llama 3.3 dissects complexity into high-retention atomic points in seconds.",
                icon: Zap 
              },
              { 
                title: "ACTIVE RECALL", 
                desc: "Proprietary scheduling ensures you review exactly when memory starts to fade.",
                icon: Brain 
              },
              { 
                title: "CLOUD SYNC", 
                desc: "Your knowledge vault is encrypted and accessible across all devices.",
                icon: ShieldCheck 
              }
            ].map((f, i) => (
              <div key={i} className="bg-background p-16 space-y-8 hover:bg-secondary/50 transition-colors">
                <f.icon className="w-8 h-8 text-foreground" />
                <h3 className="text-3xl font-black tracking-tighter uppercase">{f.title}</h3>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Massive Stats - High Impact */}
      <section className="py-60 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          {[
            { value: "500k+", label: "Cards Generated" },
            { value: "15min", label: "Time Saved Daily" }
          ].map((stat, i) => (
            <div key={i} className="border-l-4 border-foreground pl-12">
              <div className="text-[80px] sm:text-[120px] font-black tracking-tighter leading-none mb-4">{stat.value}</div>
              <div className="text-sm font-bold tracking-widest uppercase text-foreground/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-foreground" />
              <span className="font-bold text-2xl tracking-tighter">COGNITIO</span>
            </div>
            <p className="text-sm font-medium text-foreground/40">The frontier of cognitive acceleration.</p>
          </div>
          
          <div className="flex flex-col gap-4 text-xs font-black tracking-widest uppercase">
            <a href="#" className="hover:opacity-50 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Terms of Service</a>
            <a href="https://github.com/saad-78" target="_blank" className="hover:opacity-50 transition-opacity">GitHub Repository</a>
          </div>

          <p className="text-right text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em] md:col-start-3">
            © 2025 COGNITIO INC. <br /> ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>

  );
}
