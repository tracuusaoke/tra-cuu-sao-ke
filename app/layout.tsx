import './globals.css';

import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import type React from 'react';

export const metadata = {
  title: 'Tra cứu sao kê',
  description: 'Nền tảng tra cứu dữ liệu sao kê từ thiện toàn diện'
};

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning className={inter.className}>
      <body className='min-h-dvh scroll-smooth font-sans antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
