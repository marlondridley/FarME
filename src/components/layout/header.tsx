import Link from 'next/link';
import { Leaf, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Leaf className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg">FarmFinder</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
           <Link href="/discover">
            <Button variant="ghost">
              <Sparkles className="w-5 h-5 mr-2" />
              Discover
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">
              Sign Up
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
