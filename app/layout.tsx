import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Provider from '@/components/provider/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My voc',
  description: 'My vocabulary',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'

};

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
