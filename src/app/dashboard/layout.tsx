import Link from 'next/link';
import { Home, Leaf, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <Link href="/dashboard/suggestions" passHref>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Leaf className="w-5 h-5" />
              <span className="hidden sm:inline">Crop Suggestions</span>
            </Button>
          </Link>
          <Link href="#" passHref>
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
