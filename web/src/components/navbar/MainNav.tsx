import { cn } from "@/lib/utils";
import  Link  from "next/link";

interface MainNavItem {
  href: string;
  label: string;
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  items?: MainNavItem[];
}

export const MainNav = ({ className, items }: Props) => {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn("mx-6 hidden md:flex items-center space-x-6", className)}>
      {items?.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-base font-medium transition-colors hover:text-blue-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};