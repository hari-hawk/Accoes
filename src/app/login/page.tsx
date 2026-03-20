"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function LoginPage() {
  const { loginWithGoogle, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);

  const handleGoogleLogin = () => {
    setGoogleSigningIn(true);
    // Simulate SSO delay
    setTimeout(() => {
      loginWithGoogle();
    }, 1200);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSigningIn(true);
    setTimeout(() => {
      login(email.trim());
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding with hero image */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Background image — industrial HVAC/mechanical */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop')",
            animation: "slowZoom 20s ease-in-out infinite alternate",
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a44]/90 via-[#00529B]/50 to-[#003075]/40" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,26,68,0.4)_100%)]" />

        {/* Animated content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          {/* Logo — top */}
          <div
            className="flex items-center gap-3"
            style={{ animation: "fadeSlideDown 0.8s ease-out both" }}
          >
            <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-lg">
              <span className="text-sm font-bold tracking-tight">ACCO</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight block leading-tight">Submittals</span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest">Engineered Systems</span>
            </div>
          </div>

          {/* Main content — center-bottom */}
          <div className="space-y-6">
            <h1
              className="text-3xl xl:text-[2.75rem] font-bold leading-[1.15] tracking-tight"
              style={{ animation: "fadeSlideUp 0.7s ease-out 0.5s both" }}
            >
              AI-Powered Submittal
              <br />
              <span className="text-[#FFB800]">Validation Platform</span>
            </h1>

            <p
              className="text-white/70 text-base xl:text-lg leading-relaxed max-w-lg"
              style={{ animation: "fadeSlideUp 0.7s ease-out 0.7s both" }}
            >
              Streamline your construction material submittals with intelligent conformance checking, automated spec matching, and real-time collaboration.
            </p>

            {/* Feature highlights */}
            <div className="space-y-3 pt-2">
              {[
                { text: "Automated conformance validation", icon: "M9 12.75 11.25 15 15 9.75" },
                { text: "Multi-trade material matrix support", icon: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" },
                { text: "Real-time team collaboration", icon: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-3.741-2.77" },
              ].map((feature, i) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-3 group"
                  style={{ animation: `fadeSlideUp 0.6s ease-out ${0.9 + i * 0.15}s both` }}
                >
                  <div className="h-7 w-7 rounded-lg bg-[#FFB800]/20 border border-[#FFB800]/30 flex items-center justify-center shrink-0 group-hover:bg-[#FFB800]/30 transition-colors">
                    <svg className="h-3.5 w-3.5 text-[#FFB800]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <span className="text-sm text-white/80 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p
            className="text-xs text-white/35"
            style={{ animation: "fadeSlideUp 0.6s ease-out 1.4s both" }}
          >
            &copy; {new Date().getFullYear()} ACCO Engineered Systems. All rights reserved.
          </p>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeSlideDown {
            from { opacity: 0; transform: translateY(-15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slowZoom {
            from { transform: scale(1.05); }
            to { transform: scale(1.12); }
          }
        `}</style>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-2">
            <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-sm font-bold tracking-tight text-white">ACCO</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Submittals</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Google SSO button */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 text-sm font-medium gap-3 border-border/80 hover:bg-muted/50 transition-all"
            onClick={handleGoogleLogin}
            disabled={googleSigningIn || signingIn}
          >
            {googleSigningIn ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="h-5 w-5" />
            )}
            {googleSigningIn ? "Signing in..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email login form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-11"
                autoComplete="current-password"
                defaultValue="password123"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity font-medium"
              disabled={signingIn || googleSigningIn}
            >
              {signingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Contact your administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
