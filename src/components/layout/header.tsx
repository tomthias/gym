import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  backHref?: string;
}

export function Header({ title, backHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-sm lg:static lg:z-auto lg:h-auto lg:border-0 lg:bg-transparent lg:px-0 lg:pb-2 lg:pt-0 lg:backdrop-blur-none">
      {backHref && (
        <Link
          href={backHref}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <h1 className="text-lg font-semibold lg:text-2xl lg:font-bold lg:tracking-tight">{title}</h1>
    </header>
  );
}
