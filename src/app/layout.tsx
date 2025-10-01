
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth';
import Script from 'next/script';


export const metadata: Metadata = {
  title: 'FarmFinder',
  description: 'Find fresh, local produce near you.',
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} 
          strategy="beforeInteractive" 
        />
      </head>
      <body className={cn("font-sans antialiased dark", fontSans.variable)}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
