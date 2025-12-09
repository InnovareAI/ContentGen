import { Sidebar } from "@/components/Sidebar";

// Force dynamic rendering for all app pages (they require auth)
export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  );
}
