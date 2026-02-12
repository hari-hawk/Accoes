"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  CheckCircle2,
  ShieldCheck,
  Users,
  FileStack,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mock-users";

const mainNavItems = [
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
    children: [
      { title: "Conformance", href: "/conformance", icon: CheckCircle2 },
      { title: "Check Conformance", href: "/check-conformance", icon: ShieldCheck },
    ],
  },
  { title: "User Management", href: "/user-management", icon: Users },
  { title: "Project Index", href: "/project-index", icon: FileStack },
];

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-nav">
        <div className="flex h-14 items-center px-5 gap-6">
          {/* Logo */}
          <Link href="/projects" className="flex items-center gap-2.5 shrink-0 mr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-gold shadow-gold">
              <span className="text-xs font-extrabold text-white tracking-tight">A</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Submittals AI
            </span>
          </Link>

          {/* Nav items */}
          <nav className="flex items-center gap-0.5 flex-1">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/") ||
                item.children?.some(
                  (c) => pathname === c.href || pathname.startsWith(c.href + "/")
                );
              const Icon = item.icon;

              if (item.children) {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all outline-none",
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-nav-foreground/60 hover:text-white hover:bg-white/8"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item.title}</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      <DropdownMenuItem asChild>
                        <Link href={item.href} className="gap-2">
                          <Icon className="h-4 w-4" />
                          All {item.title}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <DropdownMenuItem key={child.href} asChild>
                            <Link href={child.href} className="gap-2">
                              <ChildIcon className="h-4 w-4" />
                              {child.title}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-nav-foreground/60 hover:text-white hover:bg-white/8"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-nav-foreground/60 hover:text-white hover:bg-white/10"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-nav-gold border border-nav" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-nav-foreground/60 hover:text-white hover:bg-white/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Divider */}
            <div className="h-7 w-px bg-white/12 mx-1" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-white/8 transition-colors outline-none">
                  <Avatar className="h-7 w-7 border-2 border-nav-gold/40">
                    <AvatarFallback className="text-[10px] font-bold gradient-gold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-[12px] font-semibold text-white leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-nav-gold leading-tight capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-nav-foreground/40" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-3 gradient-hero rounded-t-md -m-1 mb-1">
                  <p className="text-sm font-bold text-white">{currentUser.name}</p>
                  <p className="text-xs text-white/70">{currentUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider gradient-gold text-white">
                    {currentUser.role}
                  </span>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
