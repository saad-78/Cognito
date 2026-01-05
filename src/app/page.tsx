import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Brain, Check, TrendingUp, Star, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white antialiased overflow-x-hidden">
      
      {/* Subtle grain texture */}
      <div className="fixed inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg tracking-tight">Cognitio</span>
          </Link>
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-4 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg transition-all"
            >
              Sign in
            </Button>
          </form>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          
          {/* Social Proof Badge with Real Avatars */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 text-xs font-medium bg-white/[0.03] border border-white/[0.08] rounded-full backdrop-blur-sm">
              <div className="flex -space-x-3">
                <img 
                  src="https://i.pravatar.cc/150?img=12" 
                  alt="User" 
                  className="w-7 h-7 rounded-full border-2 border-[#0a0a0a]"
                />
                <img 
                  src="https://i.pravatar.cc/150?img=32" 
                  alt="User" 
                  className="w-7 h-7 rounded-full border-2 border-[#0a0a0a]"
                />
                <img 
                  src="https://i.pravatar.cc/150?img=45" 
                  alt="User" 
                  className="w-7 h-7 rounded-full border-2 border-[#0a0a0a]"
                />
                <img 
                  src="https://i.pravatar.cc/150?img=22" 
                  alt="User" 
                  className="w-7 h-7 rounded-full border-2 border-[#0a0a0a]"
                />
                <img 
                  src="https://i.pravatar.cc/150?img=60" 
                  alt="User" 
                  className="w-7 h-7 rounded-full border-2 border-[#0a0a0a]"
                />
              </div>
              <span className="text-white/70">Trusted by <strong className="text-white">10,000+</strong> learners worldwide</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[56px] sm:text-[72px] lg:text-[88px] font-bold tracking-[-0.04em] leading-[0.95] mb-6 text-center">
            Learn anything.
            <br />
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              Remember everything.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-[640px] mx-auto mb-10 text-center leading-relaxed tracking-[-0.01em]">
            AI-powered flashcards in 3 seconds. No manual work.
            <br className="hidden sm:block" />
            Just type a topic and start mastering it.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
            <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-semibold bg-white hover:bg-white/90 text-black rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] group shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(255,255,255,0.15)]"
              >
                Get started free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </form>
          </div>
          
          <p className="text-center text-xs text-white/40">
            No credit card • Free forever • 2 min setup
          </p>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Powered by Llama 3.3</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>AES-256 encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Check className="w-3.5 h-3.5" />
              <span>GDPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo */}
      <section className="relative px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
            
            <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 h-10 border-b border-white/[0.06] bg-white/[0.01]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="px-3 py-0.5 text-[10px] font-medium text-white/30 bg-white/[0.02] rounded border border-white/5">
                    cognitio.app/study
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-12">
                <div className="mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Live Generation</span>
                </div>
                
                <div className="text-2xl sm:text-3xl font-bold text-white/90 mb-8 tracking-tight">
                  "Quantum Entanglement"
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { q: 'What is quantum superposition?', n: 1 },
                    { q: 'Explain wave function collapse', n: 2 },
                    { q: 'Define Bell\'s inequality theorem', n: 3 }
                  ].map((card) => (
                    <div 
                      key={card.n} 
                      className="group relative p-5 border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent rounded-xl hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                        Card {card.n}
                      </div>
                      <div className="text-sm font-medium text-white/80 leading-relaxed">
                        {card.q}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                          <ArrowRight className="w-3 h-3 text-white/40" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-6 py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-white/40 mb-3 tracking-wider uppercase">
              What learners say
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]">
              Loved by students everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                "This changed how I study. I went from spending hours making flashcards to just typing a topic and having everything ready in seconds."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.pravatar.cc/150?img=28" 
                  alt="Sarah Chen" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Sarah Chen</div>
                  <div className="text-xs text-white/40">Medical Student, Stanford</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                "I've tried Anki, Quizlet, everything. This is the only tool that actually understands complex topics and makes smart questions."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.pravatar.cc/150?img=33" 
                  alt="Marcus Rodriguez" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Marcus Rodriguez</div>
                  <div className="text-xs text-white/40">Software Engineer, Google</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                "My exam scores improved by 20% after using Cognitio for just two weeks. The spaced repetition actually works."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.pravatar.cc/150?img=47" 
                  alt="Priya Patel" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Priya Patel</div>
                  <div className="text-xs text-white/40">Law Student, Harvard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-32 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-[600px] mb-20">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 text-xs font-medium text-white/50 bg-white/[0.02] border border-white/[0.06] rounded-full">
              <Sparkles className="w-3 h-3" />
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] mb-4 leading-tight">
              Everything you need
              <br />
              to learn faster
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Not just flashcards. A complete learning system built for retention.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="group relative p-8 border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl hover:border-white/[0.12] transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] mb-6 group-hover:bg-white/[0.1] transition-colors">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">
                Instant generation
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Type any topic. Get perfect flashcards in 3 seconds. Powered by Llama 3.3 70B.
              </p>
            </div>

            <div className="group relative p-8 border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl hover:border-white/[0.12] transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] mb-6 group-hover:bg-white/[0.1] transition-colors">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">
                Spaced repetition
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Smart scheduling shows cards at optimal intervals. Maximize retention, minimize time.
              </p>
            </div>

            <div className="group relative p-8 border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl hover:border-white/[0.12] transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] mb-6 group-hover:bg-white/[0.1] transition-colors">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">
                Track progress
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                See mastery levels. Monitor retention rates. Know exactly what to review next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="relative px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 sm:gap-16">
            {[
              { value: '10K+', label: 'Active learners' },
              { value: '500K+', label: 'Cards generated' },
              { value: '95%', label: 'Retention rate' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-32 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.02em] mb-6 leading-tight">
            Stop forgetting.
            <br />
            Start mastering.
          </h2>
          <p className="text-lg sm:text-xl text-white/50 mb-10 max-w-[500px] mx-auto">
            Join 10,000+ learners using Cognitio to remember everything they study.
          </p>
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg font-semibold bg-white hover:bg-white/90 text-black rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(255,255,255,0.2)]"
            >
              Start learning free
            </Button>
          </form>
          <p className="mt-4 text-sm text-white/40">
            Free forever • No credit card
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>© 2025 Cognitio</span>
          </div>
          <div className="flex gap-6">
            <a 
              href="https://github.com/saad-78" 
              className="hover:text-white/60 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/saad-momin-a1516a311" 
              className="hover:text-white/60 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
