import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect('/dashboard');

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white font-sans antialiased">
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/3 w-[800px] h-[800px] bg-blue-500/[0.08] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Llama 3.3 • Zero Busywork</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.1]" style={{fontFamily: 'DM Sans, sans-serif'}}>
          Learn Anything. <br />
          <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">Remember Forever.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-neutral-400 max-w-[600px] mb-12 leading-relaxed" style={{letterSpacing: '-0.02em'}}>
          Type a topic. Get flashcards in 3 seconds. No busywork. Just mastery.
        </p>

        {/* CTA */}
        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
          <Button size="lg" className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_40px_-8px_rgba(59,130,246,0.4)] transition-all hover:scale-105 group">
            Generate Your First Set
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        {/* Live Demo Input (Static Mockup for MVP) */}
        <div className="mt-20 w-full max-w-3xl p-8 bg-[#1A1A1A] border border-white/[0.08] rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs">LIVE DEMO</span>
          </div>
          <div className="text-2xl font-semibold text-white mb-6">"Quantum Entanglement"</div>
          <div className="grid md:grid-cols-3 gap-3">
            {['What is superposition?', 'Define wave function', 'Bell\'s theorem?'].map((q, i) => (
              <div key={i} className="p-4 bg-[#0A0A0A] border border-white/[0.05] rounded-xl">
                <div className="text-xs text-blue-400 mb-2">Q{i+1}</div>
                <div className="text-sm text-neutral-300">{q}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Features */}
      <section className="px-6 py-32 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 md:row-span-2 p-12 bg-[#1A1A1A] border border-white/[0.08] rounded-3xl hover:border-white/[0.12] transition-colors group">
            <Zap className="w-8 h-8 text-yellow-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-bold mb-4">Deep Understanding</h3>
            <p className="text-neutral-400 leading-relaxed text-lg">
              Our AI doesn't copy-paste definitions. It extracts core principles and generates questions that test comprehension, not memorization.
            </p>
          </div>
          <div className="p-8 bg-[#1A1A1A] border border-white/[0.08] rounded-3xl hover:border-white/[0.12] transition-colors">
            <Shield className="w-7 h-7 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Encrypted</h3>
            <p className="text-sm text-neutral-400">Your data, your rules. AES-256 at rest.</p>
          </div>
          <div className="p-8 bg-[#1A1A1A] border border-white/[0.08] rounded-3xl hover:border-white/[0.12] transition-colors">
            <BarChart3 className="w-7 h-7 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-sm text-neutral-400">Track mastery, not vanity metrics.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Stop re-reading.<br/>Start remembering.</h2>
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}>
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-neutral-200 rounded-full">
              Get Started Free
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-neutral-500">
          <span>© 2025 Cognitio • Built for House of Edtech</span>
          <div className="flex gap-6">
            <a href="https://github.com/saad-78" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/saad-momin-a1516a311" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
