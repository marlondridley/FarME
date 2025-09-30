import Link from 'next/link';
import { Leaf, Tractor, User } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Leaf className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg font-headline">FarmFinder</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className='hidden sm:block'>
            <Button variant="ghost" className="flex items-center gap-2">
              <Tractor className="w-5 h-5" />
              <span>Farmer Dashboard</span>
            </Button>
          </Link>
          <Link href="/dashboard" className='sm:hidden'>
            <Button variant="ghost" size="icon">
              <Tractor className="w-5 h-5" />
              <span className='sr-only'>Farmer Dashboard</span>
            </Button>
          </Link>
          <Button variant="secondary" className='rounded-full'>
            <User className="w-5 h-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
