"use client";

import type { MenuItem } from "@/actions/menu";

import { Button } from "@/components/globals/buttons/button";
import { BodyText } from "@/components/globals/typography/body-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AvatorIcon from "@/components/icons/AvatorIcon";
import BasketIcon from "@/components/icons/BasketIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useCart } from "@/hooks/useCart";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  target?: string | null;
  dropdown?: {
    label: string;
    href: string;
    target?: string | null;
  }[];
};

function mapMenuToNavItems(items: MenuItem[]): NavItem[] {
  return items.map((item) => ({
    label: item.title,
    href: item.url,
    target: item.target,
    dropdown:
      item.children.length > 0
        ? item.children.map((child) => ({
            label: child.title,
            href: child.url,
            target: child.target,
          }))
        : undefined,
  }));
}

function Header({ menuItems = [], isLoggedIn = false }: { menuItems?: MenuItem[]; isLoggedIn?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const { getItemCount } = useCart();
  const navItems = useMemo(() => mapMenuToNavItems(menuItems), [menuItems]);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setVisible(true);
      } else {
        setVisible(currentY < lastScrollY.current);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <div
        className={`fixed top-0 right-0 left-0 z-50 w-full transition-transform duration-300 ease-in-out ${
          visible && !drawerOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header>
          <div className="bg-white-100 w-full px-6 py-4">
            <div className="flex w-full flex-row items-center justify-between gap-10">
              <div className="flex flex-row items-center justify-between lg:gap-12 xl:gap-17">
                <Link href="/" className="relative h-5.5 w-22.5">
                  <Image
                    fill
                    src="/logo.svg"
                    alt="I buy secret logo"
                    className="h-full w-full object-contain"
                  />
                </Link>
                <nav className="hidden items-center justify-center gap-7.5 xl:flex">
                  {navItems.map((item) => (
                    <NavItem key={item.label} item={item} />
                  ))}
                </nav>
              </div>
              <div className="flex flex-row items-center justify-between gap-7.5 lg:gap-6 xl:gap-7.5">
                 <Suspense fallback={<div className="hidden sm:inline-flex h-10 w-20 bg-dark-5 animate-pulse rounded" />}>
                  <LoginLink className="hidden sm:inline-flex" isLoggedIn={isLoggedIn} />
                </Suspense>
                <button
                  onClick={() => setBasketOpen(true)}
                  className="text-dark-100 hover:text-brand-pink hidden items-center justify-center gap-1.5 duration-300 sm:inline-flex"
                >
                  <BasketIcon />
                  <BodyText variant="14m">Basket({getItemCount()})</BodyText>
                </button>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="text-dark-100 hover:text-brand-pink inline-flex items-center justify-center gap-1.5 duration-300 xl:hidden"
                >
                  <MenuIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      <Suspense fallback={null}>
        <MobileDrawer
          navItems={navItems}
          isLoggedIn={isLoggedIn}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onBasketClick={() => {
            setDrawerOpen(false);
            setBasketOpen(true);
          }}
        />
      </Suspense>
      <BasketDrawer open={basketOpen} onClose={() => setBasketOpen(false)} />
    </>
  );
}

const LoginLink = ({
  className,
  onClick,
  isLoggedIn,
  children,
}: {
  className?: string;
  onClick?: () => void;
  isLoggedIn: boolean;
  children?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  const href = isLoggedIn ? "/account" : `/login?callbackUrl=${encodeURIComponent(fullPath)}`;
  const label = isLoggedIn ? "Account" : "Login";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("text-dark-100 hover:text-brand-pink items-center justify-center gap-1.5 duration-300", className)}
    >
      {children || (
        <>
          <AvatorIcon />
          <BodyText variant="14m">{label}</BodyText>
        </>
      )}
    </Link>
  );
};

function MobileDrawer({
  navItems,
  isLoggedIn,
  open,
  onClose,
  onBasketClick,
}: {
  navItems: NavItem[];
  isLoggedIn: boolean;
  open: boolean;
  onClose: () => void;
  onBasketClick: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        onWheel={(e) => e.stopPropagation()}
        className={`bg-white-100 fixed top-0 left-0 z-50 flex h-full w-full flex-col transition-transform duration-300 ease-in-out sm:max-w-sm xl:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <Link href="/" onClick={onClose} className="relative h-5.5 w-22.5">
            <Image fill src="/logo.svg" alt="I buy secret logo" className="h-full w-full object-contain" />
          </Link>
          <button
            onClick={onClose}
            className="text-dark-100 hover:text-brand-pink inline-flex items-center justify-center transition-colors duration-200"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {navItems.map((item) =>
              item.dropdown ? (
                <AccordionItem key={item.href} value={item.href} className="border-dark-10/30 px-6">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <BodyText variant="14m" className="text-dark-100">
                      {item.label}
                    </BodyText>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col">
                      {item.dropdown.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          {...(link.target
                            ? { target: link.target, ...(link.target === "_blank" ? { rel: "noopener noreferrer" } : {}) }
                            : {})}
                          className="border-dark-10/30 border-b py-3 last:border-b-0"
                        >
                          <BodyText
                            variant="14r"
                            className="text-dark-90 hover:text-brand-pink underline-offset-4 transition-colors duration-200 hover:underline"
                          >
                            {link.label}
                          </BodyText>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.label} className="border-dark-10/30 border-b px-6">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    {...(item.target
                      ? { target: item.target, ...(item.target === "_blank" ? { rel: "noopener noreferrer" } : {}) }
                      : {})}
                    className="flex w-full items-center py-4"
                  >
                    <BodyText variant="14m" className="text-dark-100 hover:text-brand-pink transition-colors duration-200">
                      {item.label}
                    </BodyText>
                  </Link>
                </div>
              )
            )}
          </Accordion>
        </div>

        <div className="border-dark-10/30 border-t px-6 py-6">
          <div className="flex flex-col gap-3">
            <button className="border-dark-100 text-dark-100 hover:bg-dark-100 hover:text-white-100 inline-flex w-full items-center justify-center gap-2.5 border px-5 py-2.5 transition-colors duration-300">
              <SearchIcon />
              <BodyText variant="14m" as="span">
                Search
              </BodyText>
            </button>
            <button
              onClick={onBasketClick}
              className="border-dark-100 text-dark-100 hover:bg-dark-100 hover:text-white-100 inline-flex w-full items-center justify-center gap-2.5 border px-5 py-2.5 transition-colors duration-300"
            >
              <BasketIcon />
              <BodyText variant="14m" as="span">
                Basket
              </BodyText>
            </button>
            <LoginLink
              isLoggedIn={isLoggedIn}
              onClick={onClose}
              className="bg-brand-pink text-white-100 hover:bg-brand-pink/80 flex w-full h-11.5 items-center justify-center gap-2.5 px-5 py-2.5 transition-colors duration-300"
            >
              <AvatorIcon />
              <BodyText variant="14m" as="span">
                {isLoggedIn ? "Account" : "Login"}
              </BodyText>
            </LoginLink>
          </div>
        </div>
      </div>
    </>
  );
}

const NavItem = ({ item }: { item: NavItem }) => (
  <div className="group relative">
    <Link
      href={item.href}
      {...(item.target
        ? { target: item.target, ...(item.target === "_blank" ? { rel: "noopener noreferrer" } : {}) }
        : {})}
    >
      <BodyText variant="14m" className="text-dark-100 group-hover:text-brand-pink leading-none duration-300">
        {item.label}
      </BodyText>
    </Link>
    {item.dropdown && <DropdownPanel links={item.dropdown} />}
  </div>
);

const DropdownPanel = ({ links }: { links: NonNullable<NavItem["dropdown"]> }) => (
  <div className="bg-white-100 border-brand-pink invisible absolute top-9 -left-4 z-50 min-w-88 border-[1.5px] opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
    <div className="grid grid-cols-2 gap-6 gap-x-4 p-8">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          {...(link.target
            ? { target: link.target, ...(link.target === "_blank" ? { rel: "noopener noreferrer" } : {}) }
            : {})}
          className="transition-colors duration-200"
        >
          <BodyText
            variant="14m"
            className="text-dark-100 hover:text-brand-pink underline-offset-4 transition-all duration-200 hover:underline"
          >
            {link.label}
          </BodyText>
        </Link>
      ))}
    </div>
  </div>
);

import CheckoutProductCard from "@/components/sections/checkout/CheckoutProductCard";
import { calculateCartSummary } from "@/actions/cart";

function BasketDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, getItemCount } = useCart();
  const summary = calculateCartSummary(cart.items);

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="flex flex-col w-full! h-full sm:max-w-137.5! p-0 rounded-none">
        <DrawerHeader className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between space-y-0">
          <DrawerTitle className="text-xl font-serif">Your Bag ({getItemCount()})</DrawerTitle>
          <button onClick={onClose} className="p-1 hover:text-brand-pink transition-colors">
            <XIcon size={20} />
          </button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <BasketIcon className="w-12 h-12 text-dark-20" />
              <BodyText variant="16r" className="text-dark-40">
                Your bag is empty
              </BodyText>
              <Button onClick={onClose} className="bg-dark-100 text-white hover:bg-brand-pink">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <CheckoutProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-dark-10/10 px-6 py-6 bg-white">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center pt-4 border-t border-dashed border-dark-10">
                <BodyText variant="16m" className="text-dark-100 font-bold">
                  Total
                </BodyText>
                <BodyText variant="20b" className="text-brand-pink font-serif">
                  BDT {summary.subtotal.toLocaleString()}
                </BodyText>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="bg-brand-pink text-white-100 hover:bg-brand-pink/80 flex w-full items-center justify-center py-4 transition-colors duration-300"
            >
              Checkout Now
            </Link>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default Header;
