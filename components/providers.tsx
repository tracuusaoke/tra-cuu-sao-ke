"use client";

import * as React from "react";

import { ThemeProvider } from "next-themes";

import type { ThemeProviderProps } from "next-themes/dist/types";

export const Providers: React.FCC<{
  theme?: ThemeProviderProps;
}> = ({ theme, children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...theme}
    >
      {children}
    </ThemeProvider>
  );
};
