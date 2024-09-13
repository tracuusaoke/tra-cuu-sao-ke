import "./globals.css";

import React from "react";

import { Providers } from "~/components/providers";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import * as fonts from "~/lib/fonts";
import { cn } from "~/lib/utils";

export const metadata = {
  title: "Tra cứu sao kê",
  description: "Nền tảng tra cứu dữ liệu sao kê từ thiện toàn diện",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(Object.values(fonts).map((font) => font.variable))}
    >
      <body className="min-h-dvh scroll-smooth font-sans antialiased">
        <Providers>{children}</Providers>

        <TailwindIndicator />
      </body>
    </html>
  );
}
