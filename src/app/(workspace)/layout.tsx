import { TopNav } from "@/components/layout/top-nav";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav />
      {children}
    </div>
  );
}
