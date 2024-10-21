'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';

const queryClient = new QueryClient();

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
