import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { BrainCircuit, BarChart3, Library } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background flex selection:bg-black selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-background hidden md:block flex-shrink-0 relative">
        <div className="h-20 flex items-center px-8 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-foreground" />
            <span className="font-black text-lg tracking-tighter uppercase">COGNITIO</span>
          </Link>
        </div>
        <div className="px-4 py-10 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-6 py-4 text-sm font-black tracking-widest uppercase hover:bg-secondary transition-all"
          >
            <Library className="w-5 h-5" />
            Your Sets
          </Link>
          <Link
            href="/dashboard/stats"
            className="flex items-center gap-4 px-6 py-4 text-sm font-black tracking-widest uppercase hover:bg-secondary transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            Study Stats
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-border">
           <div className="mb-6">
              <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">Authenticated as</div>
              <div className="text-xs font-black truncate">{session.user.name ?? session.user.email}</div>
           </div>
           <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border md:hidden">
          <div className="px-6 h-20 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-foreground" />
              <span className="font-black text-lg tracking-tighter uppercase">COGNITIO</span>
            </Link>
            <SignOutButton />
          </div>
        </header>

        {/* Desktop Top Nav - Minimal */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border hidden md:block">
          <div className="px-12 h-20 flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
              Frontend / Dashboard / <span className="text-foreground">Study Sets</span>
            </div>
            <div className="flex items-center gap-6">
               <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  );
}
