'use client';

import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import { SearchIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink, // ✅ VOLTOU
} from '../../navigation-menu';
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../popover';
import { cn } from '@/lib/utils';
import { Button } from '../../button';
import { Input } from '../../input';

// Logo
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect x='88.1023' y='144.792' width='151.802' height='36.5788' rx='18.2894' transform='rotate(-38.5799 88.1023 144.792)' />
      <rect x='85.3459' y='244.537' width='151.802' height='36.5788' rx='18.2894' transform='rotate(-38.5799 85.3459 244.537)' />
    </svg>
  );
};

// Hamburger
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12L20 12" />
    <path d="M4 12H20" />
    <path d="M4 12H20" />
  </svg>
);

// TYPES
export interface NavbarNavItem {
  href?: string;
  label: string;
  action?: "sale";
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavItem[];
  cartText?: string;
  cartCount?: number;
  searchPlaceholder?: string;
  onSignInClick?: () => void;
  onCartClick?: () => void;
  searchValue?: string;
  onSearchChange?: (query: string) => void;
  rightSlot?: React.ReactNode;
  onSaleClick?: () => void;
}

const defaultNavigationLinks: NavbarNavItem[] = [
  { label: 'Ofertas', action: 'sale' },
  { label: 'Sobre', href: '/about' },
  { label: 'Contato', href: '/contact' }
];

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo = <h2 className="text-xl font-bold">My<span className="text-primary">Store</span></h2>,
      logoHref = '/',
      navigationLinks = defaultNavigationLinks,
      cartText = 'Carrinho',
      cartCount = 0,
      searchPlaceholder = 'Buscar...',
      onSignInClick,
      onCartClick,
      searchValue,
      onSearchChange,
      rightSlot,
      onSaleClick,
      ...props
    },
    ref
  ) => {

    const router = useRouter()

    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const searchId = useId();

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          setIsMobile(containerRef.current.offsetWidth < 768);
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    }, []);

    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }, [ref]);

    const handleNavClick = (link: NavbarNavItem) => {
      if (link.action === "sale") {
        onSaleClick?.()
      } else if (link.href) {
        router.push(link.href)
      }
    }

    return (
      <header
        ref={combinedRef}
        className={cn("sticky top-0 z-50 w-full border-b bg-background/95 px-4 md:px-6", className)}
        {...props}
      >
        <div className="container mx-auto flex h-16 items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            {/* MOBILE */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-64 p-2">
                  <NavigationMenu>
                    <NavigationMenuList className="flex-col gap-1">

                      <NavigationMenuItem>
                        <div className="relative">
                          <Input
                            value={searchValue ?? ""}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="pl-8"
                            placeholder={searchPlaceholder}
                          />
                          <SearchIcon className="absolute left-2 top-2 text-muted-foreground" size={16} />
                        </div>
                      </NavigationMenuItem>

                      <div className="h-px bg-border my-2" />

                      {navigationLinks.map((link, i) => (
                        <NavigationMenuItem key={i}>
                          <button
                            onClick={() => handleNavClick(link)}
                            className="w-full text-left px-3 py-2 hover:bg-accent rounded"
                          >
                            {link.label}
                          </button>
                        </NavigationMenuItem>
                      ))}

                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {/* LOGO */}
            <button
              onClick={() => router.push(logoHref)}
              className="cursor-pointer text-primary"
            >
              {logo}
            </button>

            {/* DESKTOP */}
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList className="flex gap-1">

                  {navigationLinks.map((link, i) => (
                    <NavigationMenuItem key={i}>
                      <NavigationMenuLink
                        href={link.href || "#"}
                        onClick={(e) => {
                          e.preventDefault()
                          handleNavClick(link)
                        }}
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center",
                          "rounded-md px-4 py-2 text-sm font-medium",
                          "transition-colors hover:bg-accent hover:text-primary",
                          "focus:bg-accent focus:text-primary focus:outline-none",
                          "disabled:pointer-events-none disabled:opacity-50",
                          "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}

                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* SEARCH */}
            {!isMobile && (
              <div className="relative">
                <Input
                  id={searchId}
                  value={searchValue ?? ""}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-8"
                  placeholder={searchPlaceholder}
                />
                <SearchIcon className="absolute left-2 top-2 text-muted-foreground" size={16} />
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {rightSlot || (
              <Button variant="ghost" onClick={onSignInClick}>
                Entrar
              </Button>
            )}

            <Button onClick={onCartClick} className="relative">
              {cartText}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>

          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';

export { Logo, HamburgerIcon };