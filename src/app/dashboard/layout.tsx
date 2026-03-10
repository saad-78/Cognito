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
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white/50 hidden md:block flex-shrink-0 relative">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg tracking-tight">Cognitio</span>
          </Link>
        </div>
        <div className="px-4 py-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors font-medium"
          >
            <Library className="w-5 h-5" />
            Your Sets
          </Link>
          <Link
            href="/dashboard/stats"
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            Study Stats
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (Hidden on md+) */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b md:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-lg tracking-tight">Cognitio</span>
            </Link>
            <div className="flex items-center gap-4">
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* Desktop Header (Only shows user info/logout, logo is in sidebar) */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b hidden md:block">
          <div className="px-8 h-16 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">
                {session.user.name ?? session.user.email ?? 'User'}
              </span>
              <SignOutButton />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
