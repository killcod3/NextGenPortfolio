"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { flushSync } from "react-dom";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = async () => {
    if (isTransitioning) return;

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    const transitionDocument = document as TransitionDocument;

    if (
      !transitionDocument.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    setIsTransitioning(true);
    document.documentElement.classList.add("theme-transition");

    try {
      const transition = transitionDocument.startViewTransition(() => {
        flushSync(() => setTheme(nextTheme));
      });
      await transition.finished;
    } catch {
      // Keep the selected theme even if the browser interrupts the transition.
      setTheme(nextTheme);
    } finally {
      document.documentElement.classList.remove("theme-transition");
      setIsTransitioning(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isTransitioning}
      aria-label="Toggle theme"
      className="rounded-full"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        key={resolvedTheme}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </motion.div>
    </Button>
  );
}
