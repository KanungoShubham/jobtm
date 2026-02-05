import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95",
          {
            "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5":
              variant === "default",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary hover:-translate-y-0.5":
              variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "h-10 px-6": size === "default",
            "h-8 px-3": size === "sm",
            "h-12 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
