import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  backHref?: string;
}

export function Header({ title, backHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-sm">
      {backHref && (
        <Link
          href={backHref}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
