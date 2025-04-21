'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import Sidebar from '@/components/Layout/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import { AuthProvider } from '@/providers/AuthProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Verificar se estamos na página inicial
  const isHomePage = pathname === '/';
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {!isHomePage && <Sidebar />}
        <main className={`${!isHomePage ? 'md:ml-16 lg:ml-64' : ''} pb-20 md:pb-4 p-0 min-h-screen dark:bg-gray-900`}>
          <div className="w-full px-1 sm:px-2 md:px-3 lg:px-4 xl:px-6 2xl:px-12 3xl:px-20 4xl:px-32">
            {children}
          </div>
        </main>
        {!isHomePage && <BottomNavigation />}
      </AuthProvider>
    </ThemeProvider>
  );
} 