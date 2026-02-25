import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { DraftProvider } from "@/providers/draft-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
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
            <Toaster
              position="top-center"
              offset={64}
              duration={5000}
              visibleToasts={3}
              closeButton
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: "w-full max-w-md flex items-center gap-3 rounded-lg border border-border/60 bg-card pr-10 pl-4 py-3 shadow-card text-sm font-medium pointer-events-auto relative overflow-hidden border-l-4",
                  title: "text-sm font-semibold text-foreground",
                  description: "text-xs text-muted-foreground mt-0.5",
                  success: "border-l-green-500",
                  warning: "border-l-amber-500",
                  error: "border-l-red-500",
                  info: "border-l-blue-500",
                },
              }}
            />
          </DraftProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
