
"use client";

import Link from 'next/link';
import { Home, Leaf, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    if (!user) {
      router.push('/login');
      return;
    }
    // Secure the dashboard for farmers only
    if (user.role !== 'farmer') {
      router.push('/');
    }
  }, [user, loading, router]);

  // Render null or a loading spinner while checking auth and role
  if (loading || !user || user.role !== 'farmer') {
    return (
       <div className="flex items-center justify-center h-screen">
         {/* You can replace this with a more sophisticated loading skeleton */}
         <p>Loading...</p>
       </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-16 sm:w-64 bg-secondary/30 p-2 sm:p-4 border-r flex flex-col">
        <h2 className="text-lg font-semibold mb-4 hidden sm:block">Farmer Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Overview</span>
            </Button>
          </Link>
          <Link href="/dashboard/settings" passHref>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </Link>
        </nav>
      </aside>
      <div className="flex-1 p-4 sm:p-8 bg-background overflow-auto">
        {children}
      </div>
    </div>
  );
}
