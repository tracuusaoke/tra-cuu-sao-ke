'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import type * as React from 'react';

const queryClient = new QueryClient();

export const Providers: React.FCC<{
  theme?: ThemeProviderProps;
}> = ({ theme, children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem={false}
        disableTransitionOnChange
        {...theme}
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
