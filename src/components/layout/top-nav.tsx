"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Users,
  FileStack,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mock-users";

const mainNavItems = [
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "User Management", href: "/user-management", icon: Users },
  { title: "Project Index", href: "/project-index", icon: FileStack },
];

/* -------------------------------------------------------------------------- */
/*  Mock notifications                                                        */
/* -------------------------------------------------------------------------- */

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "review";
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Submittal ready for review",
    description: "Structural Steel submittal is now ready for review on Riverside Commercial Tower",
    time: "2 min ago",
    read: false,
    type: "success",
  },
  {
    id: "n2",
    title: "Assigned as reviewer",
    description: "You've been assigned as reviewer on Harbor District Mixed Use",
    time: "15 min ago",
    read: false,
    type: "review",
  },
  {
    id: "n3",
    title: "New project created",
    description: "Parkview Residential Complex has been created by Sarah Mitchell",
    time: "1 hr ago",
    read: false,
    type: "info",
  },
  {
    id: "n4",
    title: "Added as collaborator",
    description: "You've been added as collaborator on Metro Line Extension Phase 3",
    time: "3 hrs ago",
    read: true,
    type: "info",
  },
  {
    id: "n5",
    title: "Submittal ready for review",
    description: "HVAC Equipment submittal is now ready for review on Downtown Office Renovation",
    time: "5 hrs ago",
    read: true,
    type: "success",
  },
  {
    id: "n6",
    title: "Assigned as reviewer",
    description: "You've been assigned as reviewer on Central Campus Addition",
    time: "Yesterday",
    read: true,
    type: "review",
  },
];

const notifIconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  review: FileText,
};

const notifColorMap = {
  info: "text-blue-500",
  success: "text-status-pre-approved",
  warning: "text-status-review-required",
  review: "text-purple-500",
};

/* -------------------------------------------------------------------------- */
/*  Profile & Settings Dialogs                                                */
/* -------------------------------------------------------------------------- */

function ProfilePanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b pr-12">
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription className="sr-only">Your profile information</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full gradient-accent flex items-center justify-center shadow-glow">
                <span className="text-xl font-bold text-white">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <Badge variant="secondary" className="mt-1 text-[10px] capitalize bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{currentUser.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{currentUser.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">05/01/2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects</span>
                <span className="font-medium">5 active</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function SettingsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b pr-12">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription className="sr-only">Application settings</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email alerts for reviews</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-nav-accent relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Browser push for urgent items</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-nav-accent relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-muted-foreground">Interface language</p>
                </div>
                <span className="text-sm font-medium text-muted-foreground">English</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*  TopNav component                                                          */
/* -------------------------------------------------------------------------- */

export function TopNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Notification panel state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Profile & Settings dialog state
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-nav">
          <div className="flex h-14 items-center px-5 gap-6">
            {/* Logo — "acco" brand mark */}
            <Link href="/projects" className="flex items-center gap-2 shrink-0 mr-2">
              <div className="flex items-center gap-0.5">
                <span className="text-base font-extrabold text-nav-gold tracking-tight">
                  acco
                </span>
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
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;

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
                onClick={() => setNotifOpen(true)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-nav-gold border border-nav flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                  </span>
                )}
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
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
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

      {/* Notification Panel */}
      <Sheet open={notifOpen} onOpenChange={setNotifOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b pr-12">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base">Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-nav-accent"
                  onClick={markAllRead}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <SheetDescription className="sr-only">Your notifications</SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const NIcon = notifIconMap[notif.type];
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex gap-3 px-5 py-3.5 transition-colors relative group",
                        !notif.read && "bg-nav-accent/5"
                      )}
                    >
                      <div className={cn("mt-0.5 shrink-0", notifColorMap[notif.type])}>
                        <NIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm leading-tight", !notif.read && "font-medium")}>
                            {notif.title}
                          </p>
                          <button
                            type="button"
                            onClick={() => dismissNotif(notif.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notif.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-nav-accent" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Profile Panel */}
      <ProfilePanel open={profileOpen} onOpenChange={setProfileOpen} />

      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
