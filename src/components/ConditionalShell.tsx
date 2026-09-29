'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { hasDarkHero } from '@/lib/darkHeroRoutes';

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname?.startsWith('/admin') || pathname?.startsWith('/employer') || pathname?.startsWith('/jobseeker');

  if (isStandalone) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className={`flex-1 overflow-x-hidden ${hasDarkHero(pathname) ? "" : "pt-16"}`}>{children}</main>
      <Footer />
    </div>
  );
}
