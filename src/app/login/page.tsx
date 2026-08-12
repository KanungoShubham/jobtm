'use client';
import Link from 'next/link';
import { HiOfficeBuilding, HiUser, HiSpeakerphone, HiArrowLeft, HiArrowRight } from 'react-icons/hi';

const OPTIONS = [
  {
    href: '/employer/login',
    label: 'Employer',
    desc: 'Post jobs and manage your hiring pipeline',
    icon: HiOfficeBuilding,
    color: '#7C3AED',
    tint: '#EDE9FE',
  },
  {
    href: '/jobseeker/login',
    label: 'Job Seeker',
    desc: 'Find jobs and build your career profile',
    icon: HiUser,
    color: '#0EA5E9',
    tint: '#E0F2FE',
  },
  {
    href: '/advertiser/login',
    label: 'Ad Center',
    desc: 'Run banner ads and reach real users',
    icon: HiSpeakerphone,
    color: '#F59E0B',
    tint: '#FEF3C7',
  },
];

export default function LoginChooserPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-8">
          <HiArrowLeft className="w-3.5 h-3.5" /> Back to website
        </Link>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Sign In</h1>
        <p className="text-sm text-slate-400 mb-8">Choose your account type to continue</p>

        <div className="space-y-3">
          {OPTIONS.map((o) => (
            <Link key={o.href} href={o.href}
              className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-warm-lg hover-lift transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: o.tint }}>
                <o.icon className="w-6 h-6" style={{ color: o.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">{o.label}</p>
                <p className="text-xs text-slate-400">{o.desc}</p>
              </div>
              <HiArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
