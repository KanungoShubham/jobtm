'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { advertiserAuth } from '@/lib/roleAuth';

const COLOR = '#F59E0B';

export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/advertiser/login' || pathname === '/advertiser/register';
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isAuthPage) { setReady(true); return; }
    const token = advertiserAuth.getToken();
    if (!token) { router.replace('/advertiser/login'); return; }
    setReady(true);
  }, [pathname, router, isAuthPage]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: COLOR, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
