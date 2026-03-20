'use client';

import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import { SearchIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...(props as any)}>
      <rect
        x='88.1023'
        y='144.792'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 88.1023 144.792)'
        fill='currentColor'
      />
      <rect
        x='85.3459'
        y='244.537'
        width='151.802'
        height='36.5788'
        rx='18.2894'
        transform='rotate(-38.5799 85.3459 244.537)'
        fill='currentColor'
      />
    </svg>
  );
};

// Hamburger icon component
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
    xmlns="http://www.w3.org/2000/svg"
    {...(props as any)}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Types
export interface NavbarNavItem {
  href?: string;
  label: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavItem[];
  signInText?: string;
  signInHref?: string;
  cartText?: string;
  cartHref?: string;
  cartCount?: number;
  searchPlaceholder?: string;
  onSignInClick?: () => void;
  onCartClick?: () => void;
  searchValue?: string;
  onSearchChange?: (query: string) => void;
  rightSlot?: React.ReactNode; 
  onSaleClick?: () => void; // 🔥 alterado aqui
}

// Default navigation links
const defaultNavigationLinks: NavbarNavItem[] = [
  { href: '#', label: 'Sale' }, // 🔥 alterado aqui
  { href: '/About', label: 'About'},
  { href: '/Contact', label: 'Contact'}
];

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo = <h2 className="text-xl font-bold tracking-tight">My<span className="text-primary">Store</span></h2>,
      logoHref = '/',
      navigationLinks = defaultNavigationLinks,
      signInText = 'Sign In',
      signInHref = '#signin',
      cartText = 'Cart',
      cartHref = '#cart',
      cartCount = 2,
      searchPlaceholder = 'Search...',
      onSignInClick,
      onCartClick,
      searchValue,
      onSearchChange,
      rightSlot,
      onSaleClick, // 🔥 alterado aqui
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
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768);
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6",
          className
        )}
        {...(props as any)}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-8">

            {/* MOBILE MENU */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent cursor-pointer"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-64 p-2">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-1">

                      {/* SEARCH */}
                      <NavigationMenuItem className="w-full px-2 py-1.5">
                        <div className="relative w-full">
                          <Input
                            value={searchValue ?? ""}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="peer h-9 w-full ps-8"
                            placeholder={searchPlaceholder}
                            type="search"
                          />
                          <SearchIcon
                            size={16}
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                        </div>
                      </NavigationMenuItem>

                      <div className="w-full h-px bg-border my-2" />

                      {/* LINKS */}
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              if (link.label === "Ofertas") {
                                onSaleClick?.()
                              }
                            }}
                            className="cursor-pointer w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition"
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

            {/* LOGO + NAV */}
            <div className="flex items-center gap-8">

              {/* LOGO */}
              <button
                onClick={() => router.push(logoHref)}
                className="flex items-center text-primary cursor-pointer"
              >
                {logo}
              </button>

              {/* DESKTOP NAV */}
              {!isMobile && (
                <NavigationMenu>
                  <NavigationMenuList className="flex gap-1 mt-1.5">

                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          href={link.href}
                          onClick={(e) => {
                            if (link.label === "Ofertas") {
                              e.preventDefault()
                              onSaleClick?.()
                            }
                          }}
                          className="cursor-pointer text-muted-foreground hover:text-primary font-medium transition-colors inline-flex items-center h-10 text-sm rounded-md hover:bg-accent/50"
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}

                  </NavigationMenuList>
                </NavigationMenu>
              )}

              {/* SEARCH DESKTOP */}
              {!isMobile && (
              <div className="relative">
                <Input
                  id={searchId}
                  value={searchValue ?? ""}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="h-8 w-58 pl-8"
                  placeholder={searchPlaceholder}
                  type="search"
                />
                <SearchIcon
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            )}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            
            

            {/* LOGIN */}
            {rightSlot ? (
              rightSlot
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  onSignInClick?.()
                }}
              >
                {signInText}
              </Button>
            )}

            {/* CART */}
            <Button
              size="sm"
              className="cursor-pointer relative"
              onClick={(e) => {
                e.preventDefault()
                onCartClick?.()
              }}
            >
              {cartText}

              {/* BADGE */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>

          </div>
        </div>
      </header>
    )
  }
);

Navbar.displayName = 'Navbar';

export { Logo, HamburgerIcon };