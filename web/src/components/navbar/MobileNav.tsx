"use client";

import Link from "next/link";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface NavbarLink {
  text: string;
  href: string;
}

interface MobileNavProps {
  name: string;
  homeUrl: string;
  mobileLinks: NavbarLink[];
}

export function MobileNav({ name, homeUrl, mobileLinks }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <VisuallyHidden.Root>
          <SheetTitle>Menú de Navegación Móvil</SheetTitle>
        </VisuallyHidden.Root>
        <VisuallyHidden.Root>
            <SheetDescription>
              Navegación principal del sitio.
            </SheetDescription>
          </VisuallyHidden.Root>
        <nav className="grid gap-6 text-lg font-medium pt-4">
          <Link
            href={homeUrl}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <span>{name}</span>
          </Link>
          {mobileLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
