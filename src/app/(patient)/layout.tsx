import { BottomNav } from "@/components/layout/bottom-nav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
