'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { BrainCircuit, Layout, TrendingUp, Globe, LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 border-r border-border bg-background">
      <div className="p-8 pb-12">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-background" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">COGNITIO</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {[
          { label: 'Intelligence', href: '/dashboard', icon: Layout },
          { label: 'Neural Stats', href: '/dashboard/stats', icon: TrendingUp },
          { label: 'Cloud Node', href: '/dashboard/cloud', icon: Globe },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 transition-all group",
              pathname === item.href
                ? "bg-foreground text-background"
                : "text-foreground/40 hover:text-foreground hover:bg-secondary"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-8 border-t border-border mt-auto">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-destructive transition-colors group w-full"
        >
          <span className="w-1.5 h-1.5 bg-foreground/20 group-hover:bg-destructive" />
          Terminate_Session
        </button>
      </div>
    </aside>
  );
}
