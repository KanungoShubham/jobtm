'use client';
import Link from 'next/link';
import {
  HiStar, HiReceiptTax, HiGift, HiBell, HiAcademicCap, HiCalendar,
  HiQuestionMarkCircle, HiArrowRight, HiLogout,
} from 'react-icons/hi';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const TILES = [
  { href: '/jobseeker/subscription', label: 'My Subscription', desc: 'View plan & upgrade', icon: HiStar, bg: '#7C3AED' },
  { href: '/jobseeker/billing', label: 'Billing History', desc: 'Payments & invoices', icon: HiReceiptTax, bg: '#0891B2' },
  { href: '/jobseeker/rewards', label: 'Rewards & Coupons', desc: 'Scratch cards & offers', icon: HiGift, bg: '#D97706' },
  { href: '/jobseeker/notifications', label: 'Notifications', desc: 'Manage your alerts', icon: HiBell, bg: '#EA580C' },
  { href: '/jobseeker/activities/my', label: 'My Activities', desc: 'Classes & coaching you offer', icon: HiAcademicCap, bg: '#1D4ED8' },
  { href: '/jobseeker/bookings', label: 'My Bookings', desc: 'Sessions you’ve paid for', icon: HiCalendar, bg: '#0284C7' },
];

function SignOutButton() {
  const signOut = () => {
    jobseekerAuth.clearSession();
    window.location.href = '/jobseeker/login';
  };
  return (
    <button onClick={signOut} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 hover:bg-red-100 transition">
      <HiLogout className="w-4 h-4" /> Sign Out
    </button>
  );
}

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-slate-900">Account</h1>
        <p className="text-sm text-slate-400">Subscription, billing, rewards & more</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {TILES.map((t, i) => {
          const Icon = t.icon;
          return (
            <ScrollReveal key={t.href} animation="fade-up" delay={i * 30}>
              <Link href={t.href} className="block rounded-2xl p-5 text-white hover-lift transition-all duration-300" style={{ backgroundColor: t.bg }}>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm">{t.label}</p>
                <p className="text-xs text-white/70 mt-0.5">{t.desc}</p>
                <p className="flex items-center gap-1 text-xs font-semibold text-white/80 mt-3">
                  Open <HiArrowRight className="w-3 h-3" />
                </p>
              </Link>
            </ScrollReveal>
          );
        })}

        <ScrollReveal animation="fade-up" delay={TILES.length * 30}>
          <div className="sm:col-span-2 rounded-2xl p-5 text-white" style={{ backgroundColor: '#059669' }}>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
              <HiQuestionMarkCircle className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm">Help & Support</p>
            <p className="text-xs text-white/70 mt-0.5">FAQ · Call us · WhatsApp · Email</p>
          </div>
        </ScrollReveal>

        <div className="sm:col-span-2">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
