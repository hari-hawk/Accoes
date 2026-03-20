"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* Platform logo — matches top-nav brand mark */
function AccoLogo() {
  return (
    <svg width="150" height="36" viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ACCO Submittals">
      <circle cx="18" cy="18" r="16" fill="#00529B" />
      <text x="18" y="22" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">ACCO</text>
      <text x="90" y="24" textAnchor="middle" fill="white" fontSize="16" fontWeight="600" fontFamily="Inter, sans-serif">Submittals</text>
    </svg>
  );
}

const slides = [
  {
    title: "AI-Powered Submittal Validation",
    description: "Intelligent conformance checking that catches discrepancies before they become costly field issues.",
  },
  {
    title: "Multi-Trade Material Matrix",
    description: "Unified material tracking across Mechanical, Plumbing, Electrical, and all construction trades.",
  },
  {
    title: "Real-Time Team Collaboration",
    description: "Engineers, contractors, and reviewers working together with live status updates and annotations.",
  },
];

export default function LoginPage() {
  const { loginWithGoogle, login, isLoading } = useAuth();
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    setGoogleSigningIn(true);
    setTimeout(() => { loginWithGoogle(); }, 1200);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSigningIn(true);
    setTimeout(() => { login(email.trim()); }, 800);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001a44]" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — branding with hero image (no logo) ── */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop')",
            animation: "slowZoom 25s ease-in-out infinite alternate",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a44]/90 via-[#00529B]/50 to-[#003075]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,26,68,0.4)_100%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          {/* Spacer — logo removed from left */}
          <div />

          {/* Rotating slide content */}
          <div className="space-y-6">
            <div className="relative min-h-[160px]" aria-live="polite">
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeSlide === i ? 1 : 0,
                    transform: activeSlide === i ? "translateY(0)" : "translateY(12px)",
                  }}
                  aria-hidden={activeSlide !== i}
                >
                  <h2 className="text-3xl xl:text-[2.75rem] font-bold leading-[1.1] tracking-tight">
                    {slide.title.split(" ").map((word, wi) => {
                      const gold = ["AI-Powered", "Multi-Trade", "Real-Time"];
                      return gold.includes(word) ? (
                        <span key={wi} className="text-[#FFB800]">{word} </span>
                      ) : <span key={wi}>{word} </span>;
                    })}
                  </h2>
                  <p className="text-white/65 text-base xl:text-lg leading-relaxed mt-5 max-w-lg">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-3 pt-4" role="tablist" aria-label="Feature slides">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: activeSlide === i ? 40 : 16 }}
                  role="tab"
                  aria-selected={activeSlide === i}
                  aria-label={`Slide ${i + 1}: ${slide.title}`}
                >
                  <div className="absolute inset-0 bg-white/25 rounded-full" />
                  {activeSlide === i && (
                    <div className="absolute inset-0 bg-[#FFB800] rounded-full" style={{ animation: "slideProgress 5s linear forwards" }} />
                  )}
                </button>
              ))}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["Conformance AI", "Spec Matching", "Material Matrix", "Live Review"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/12 text-xs font-medium text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} ACCO Engineered Systems. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel — dark navy login ── */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#0d1f3c] via-[#112240] to-[#0a1628]">
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#00529B]/20 blur-3xl" />
          <div className="absolute top-1/3 -left-16 h-56 w-56 rounded-full bg-[#1e40af]/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#FFB800]/8 blur-3xl" />
        </div>

        {/* Login form */}
        <main className="relative z-10 w-full max-w-[380px] space-y-7" style={{ animation: "fadeSlideUp 0.6s ease-out 0.2s both" }}>

          {/* Platform logo with "Submittals" */}
          <div className="flex justify-center" style={{ animation: "fadeSlideDown 0.7s ease-out both" }}>
            <AccoLogo />
          </div>

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Sign In
            </h1>
            <p className="text-sm text-white/50">
              Welcome to your ACCO AI workspace
            </p>
          </div>

          {/* Google SSO */}
          <Button
            size="lg"
            className="w-full h-12 text-sm font-medium gap-3 bg-white hover:bg-white/90 text-gray-800 border-0 shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-[#FFB800] focus-visible:ring-offset-2 focus-visible:ring-offset-[#112240]"
            onClick={handleGoogleLogin}
            disabled={googleSigningIn || signingIn}
          >
            {googleSigningIn ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon className="h-5 w-5" />}
            {googleSigningIn ? "Signing in..." : "Sign in with Google"}
          </Button>

          {/* Divider */}
          <div className="relative" role="separator">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-[#112240] px-3 text-white/30">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email / Password */}
          <form onSubmit={handleEmailLogin} className="space-y-4" aria-label="Email sign in">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-white/60">
                Email address
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white/8 backdrop-blur-sm border-white/12 text-white placeholder:text-white/25 focus-visible:border-[#FFB800]/50 focus-visible:ring-[#FFB800]/20"
                autoComplete="email"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-medium text-white/60">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-medium text-[#FFB800]/70 hover:text-[#FFB800] transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className="h-11 bg-white/8 backdrop-blur-sm border-white/12 text-white placeholder:text-white/25 focus-visible:border-[#FFB800]/50 focus-visible:ring-[#FFB800]/20"
                autoComplete="current-password"
                defaultValue="password123"
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 bg-[#FFB800] hover:bg-[#e5a600] text-[#0f1729] font-semibold shadow-lg shadow-[#FFB800]/20 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#112240]"
              disabled={signingIn || googleSigningIn}
            >
              {signingIn ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
              ) : "Sign in"}
            </Button>
          </form>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <svg className="h-3.5 w-3.5 text-white/25" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <span className="text-[11px] text-white/25">Enterprise-grade security</span>
          </div>
        </main>

        <p className="absolute bottom-5 text-[11px] text-white/15">
          &copy; {new Date().getFullYear()} ACCO Engineered Systems
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
