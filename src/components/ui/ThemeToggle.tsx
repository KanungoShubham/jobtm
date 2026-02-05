"use client";

import * as React from "react";
import { HiMoon, HiSun } from "react-icons/hi";
import { useTheme } from "next-themes";
import { Button } from "./Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <span className="sr-only">Toggle theme</span>
        <HiSun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-8 w-8 p-0"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <HiSun className="h-4 w-4 transition-all" />
      ) : (
        <HiMoon className="h-4 w-4 transition-all" />
      )}
    </Button>
  );
}
