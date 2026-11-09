"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { getPersonalInfo } from "@/lib/config";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  const personalInfo = getPersonalInfo();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setIsOpen(false);
        setHidden(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const navigation = navigationRef.current;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(document.querySelectorAll("main, footer"));
    const previousInert = background.map(element => element.getAttribute("inert"));
    document.body.style.overflow = "hidden";
    background.forEach(element => element.setAttribute("inert", ""));

    const focusableElements = () => Array.from(
      navigation?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    ).filter(element => element.getClientRects().length > 0);

    const focusFirstLink = () => {
      navigation?.querySelector<HTMLElement>("#mobile-navigation a")
        ?.focus({ preventScroll: true });
    };
    focusFirstLink();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        setHidden(false);
      } else if (event.key === "Tab") {
        const elements = focusableElements();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus({ preventScroll: true });
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus({ preventScroll: true });
        }
      }
    };
    const keepFocusInside = (event: FocusEvent) => {
      if (!navigation?.contains(event.target as Node)) focusFirstLink();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", keepFocusInside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => {
        const value = previousInert[index];
        if (value === null) element.removeAttribute("inert");
        else element.setAttribute("inert", value);
      });
      const focusTarget = window.matchMedia("(min-width: 768px)").matches
        ? navigation?.querySelector<HTMLElement>("header a")
        : toggle;
      focusTarget?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setHidden(false);
  };
  
  return (
    <div
      ref={navigationRef}
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? true : undefined}
      aria-label={isOpen ? "Site navigation" : undefined}
    >
    <motion.header
      className={cn(
        "fixed top-0 w-full z-40 backdrop-blur-sm transition-all duration-300",
        isOpen || scrollY.get() > 50 ? "bg-background/80" : "bg-transparent"
      )}
      initial={{ y: 0 }}
      animate={{ y: hidden && !isOpen ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold" onClick={closeMenu}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {personalInfo.name.split(' ')[0]}<span className="text-primary">{personalInfo.name.split(' ')[1] || ''}</span>
          </motion.span>
        </Link>
        
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="text-base font-medium rounded-full px-4"
                >
                  <Link href={item.href} onClick={closeMenu}>
                    {item.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </nav>
          
          <ThemeSwitch />
          
          {/* Mobile Menu Toggle */}
          <Button
            ref={toggleRef}
            variant="ghost"
            size="icon"
            className="block md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </motion.header>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-md overflow-y-auto pt-20 pb-6 px-4 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="flex flex-col gap-2">
            {navItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-lg py-6"
                  onClick={closeMenu}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </div>
  );
}
