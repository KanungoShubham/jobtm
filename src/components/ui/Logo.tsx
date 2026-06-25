import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export function Logo({ className, width = 40, height = 40, showText = true }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/assets/jobslogo.png"
        alt="Jobstm Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
