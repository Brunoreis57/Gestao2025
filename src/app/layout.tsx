import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Sidebar from '@/components/Layout/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestão 2025',
  description: 'Sistema de gestão financeira e agenda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Sidebar />
            <main className="md:ml-16 lg:ml-64 pb-20 md:pb-4 p-0 min-h-screen dark:bg-gray-900">
              <div className="w-full px-1 sm:px-2 md:px-3 lg:px-4 xl:px-6 2xl:px-12 3xl:px-20 4xl:px-32">
                {children}
              </div>
            </main>
            <BottomNavigation />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 