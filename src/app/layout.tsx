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
                  toast: "w-full max-w-md flex items-center gap-3 rounded-lg border pr-10 pl-4 py-3 shadow-card text-sm font-medium pointer-events-auto relative overflow-hidden border-l-4",
                  title: "text-sm font-semibold",
                  description: "text-xs opacity-80 mt-0.5",
                  success: "bg-green-50 border-green-200 border-l-green-500 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:border-l-green-500 dark:text-green-300",
                  warning: "bg-amber-50 border-amber-200 border-l-amber-500 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:border-l-amber-400 dark:text-amber-300",
                  error: "bg-red-50 border-red-200 border-l-red-500 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:border-l-red-400 dark:text-red-300",
                  info: "bg-blue-50 border-blue-200 border-l-blue-500 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:border-l-blue-400 dark:text-blue-300",
                },
              }}
            />
          </DraftProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
