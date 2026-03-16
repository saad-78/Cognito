import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

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
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white">
      <div className="flex">
        <DashboardNav user={session.user} />

        <div className="flex-1 md:pl-72">
          <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">NODE_049 // ONLINE</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black uppercase tracking-widest leading-none">{session.user.name}</div>
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/20 mt-1">Level 04 Intelligence</div>
              </div>
              <div className="w-10 h-10 border border-border bg-secondary flex items-center justify-center font-black text-xs">
                {session.user.name?.[0]}
              </div>
            </div>
          </header>

          <main className="p-12 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
