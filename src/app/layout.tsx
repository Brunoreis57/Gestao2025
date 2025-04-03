import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Sidebar from '@/components/Layout/Sidebar';

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
          <Sidebar />
          <main className="lg:ml-64 p-4 min-h-screen dark:bg-gray-900">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
} 