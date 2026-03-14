'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Brain, Check, TrendingUp, Star, BrainCircuit, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white font-sans">Cognitio</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="px-5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="hidden sm:flex bg-white hover:bg-white/90 text-black text-sm font-semibold rounded-full px-6 transition-all shadow-xl"
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-10 text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full"
          >
            <Sparkles className="w-3 h-3" />
            Next Gen Learning AI
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[64px] sm:text-[90px] lg:text-[120px] font-black tracking-[-0.05em] leading-[0.85] mb-8"
          >
            Study <span className="text-gradient">Smarter</span>,
            <br />
            Not Harder.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-2xl text-white/50 max-w-[700px] mx-auto mb-12 leading-relaxed font-medium"
          >
            Cognitio turns any topic into professional study sets in seconds.
            Master your exams with AI-generated flashcards.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="h-14 px-10 text-lg font-bold bg-primary hover:bg-blue-600 text-white rounded-full transition-all hover:scale-[1.05] active:scale-[0.98] group shadow-[0_20px_40px_-12px_rgba(59,130,246,0.5)]"
            >
              Get started for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://i.pravatar.cc/150?u=${i}`}
                  alt="User"
                  className="w-10 h-10 rounded-full border-4 border-background"
                />
              ))}
              <span className="ml-4 text-sm font-medium text-white/40 tracking-tight">
                Trusted by <span className="text-white">5,000+</span> students
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="px-6 py-32 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4">Built for Mastery.</h2>
            <p className="text-lg text-white/40">Powerful features to accelerate your learning curve.</p>
          </div>

          <div className="grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 glass rounded-3xl p-10 glass-hover overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 border border-blue-500/30">
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Flash Insight Gen</h3>
                <p className="text-white/50 text-lg max-w-md leading-relaxed">
                  Our Llama 3.3 backbone dissects any topic into high-retention atomic points in under 3 seconds.
                </p>
              </div>
              <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
                <BrainCircuit className="w-64 h-64 text-blue-500" />
              </div>
            </div>

            <div className="md:col-span-2 glass rounded-3xl p-10 glass-hover">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 border border-purple-500/30">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Active Recall</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                Proprietary algorithms that schedule reviews exactly when your memory starts fading.
              </p>
            </div>

            <div className="md:col-span-2 glass rounded-3xl p-10 glass-hover">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-8 border border-green-500/30">
                <ShieldCheck className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Cloud Secure</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                Your knowledge library is encrypted at rest and accessible from any device, anywhere.
              </p>
            </div>

            <div className="md:col-span-4 glass rounded-3xl p-10 glass-hover flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-8 border border-orange-500/30">
                  <Globe className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Global Knowledge Hub</h3>
                <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                  Share study sets with peers or explore the public library of over 100,000+ validated sets.
                </p>
              </div>
              <div className="mt-8 flex gap-3">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-white/5 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { value: "10k+", label: "Daily Active" },
            { value: "500k+", label: "Cards Born" },
            { value: "98%", label: "Satisfaction" },
            { value: "15min", label: "Time Saved/Day" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl sm:text-5xl font-black mb-2 text-gradient">{stat.value}</div>
              <div className="text-white/40 font-semibold tracking-widest text-xs uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tighter">Cognitio</span>
          </div>
          <div className="flex gap-8 text-white/40 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://github.com/saad-78" target="_blank" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-white/20 text-sm">© 2025 Cognitio Inc.</p>
        </div>
      </footer>
    </div>
  );
}
