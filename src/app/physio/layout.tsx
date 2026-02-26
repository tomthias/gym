import { PhysioSidebar } from "@/components/layout/physio-sidebar";
import { PhysioMobileNav } from "@/components/layout/physio-mobile-nav";

export default function PhysioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <PhysioSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-8 py-6">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile layout */}
      <div className="lg:hidden pb-20">
        {children}
        <PhysioMobileNav />
      </div>
    </div>
  );
}
