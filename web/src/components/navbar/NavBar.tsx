import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import { MainNav } from "./MainNav";
import { MobileNav } from "./MobileNav";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  name = siteConfig.name,
  homeUrl = siteConfig.url,
  mobileLinks = [
    { text: "Inicio", href: siteConfig.url },
    { text: "Servicios", href: siteConfig.url },
    { text: "Beneficios", href: siteConfig.url },
    { text: "Contacto", href: siteConfig.url },
  ],
  actions = [
    {
      text: "Ingresar",
      href: `${siteConfig.url}/auth/login`,
      isButton: true,
      variant: "primaryBlue",
    },
  ],
  showNavigation = true,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              <Image
                src={"/assets/MainLogo.png"}
                width={80}
                height={80}
                alt={"main logo"}
                priority
              />
            </a>
            {showNavigation && <MainNav items={siteConfig.mainNav} />}
          </NavbarLeft>
          <NavbarRight>
            {actions.map((action, index) =>
              action.isButton ? (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  asChild
                >
                  <Link href={action.href}>
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </Link>
                </Button>
              ) : (
                <Link
                  key={index}
                  href={action.href}
                  className="hidden text-sm md:block"
                >
                  {action.text}
                </Link>
              )
            )}
            <MobileNav
              name={name}
              homeUrl={homeUrl}
              mobileLinks={mobileLinks}
            />
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
