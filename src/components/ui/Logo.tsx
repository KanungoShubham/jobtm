import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export function Logo({ className, width = 100, height = 100, showText = true }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3 group", className)}>
      <div className="relative transition-all duration-300 group-hover:scale-110">
        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md animate-pulse group-hover:bg-primary/40 transition-all duration-300"></div>
        <div className="relative">
          <Image
            src="/assets/jobslogo.png"
            alt="Jobs TM Logo"
            width={width}
            height={height}
            className="relative object-contain transition-all duration-300 group-hover:rotate-3"
            priority
          />
        </div>
      </div>
   
    </div>
  );
}
