import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { DraftProvider } from "@/providers/draft-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Accoes Submittal AI",
  description: "AI-powered B2B workspace for project submittal validation",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='18' r='16' fill='%2300529B'/><text x='18' y='22' text-anchor='middle' fill='white' font-size='9' font-weight='700' font-family='sans-serif'>ACCO</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <DraftProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </DraftProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
