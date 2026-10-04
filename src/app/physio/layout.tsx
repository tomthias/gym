import { PhysioSidebar } from "@/components/layout/physio-sidebar";
import { PhysioMobileNav } from "@/components/layout/physio-mobile-nav";
import { I18nProvider } from "@/lib/i18n/client";

export default function PhysioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The physio area is Italian-only: shared components must not follow
  // the patient's language preference.
  return (
    <I18nProvider locale="it">
      <div className="min-h-dvh bg-background">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <PhysioSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-4/5 py-6">
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
    </I18nProvider>
  );
}
