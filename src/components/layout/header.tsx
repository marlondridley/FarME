
"use client";

import Link from 'next/link';
import { Leaf, Sparkles, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export default function Header() {
  const { user } = useAuth();
  const handleSignOut = async () => {
    await signOut(auth);
  };

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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className='h-10 w-10'>
                     <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                     <AvatarFallback>
                        <UserIcon />
                     </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
