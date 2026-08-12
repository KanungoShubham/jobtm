'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HiBriefcase, HiUserGroup, HiPlusCircle, HiBell,
  HiCheckCircle, HiChevronRight, HiOutlineBriefcase,
} from 'react-icons/hi';
import { employerApi, subscriptionApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#7C3AED';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function EmployerDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    const token = employerAuth.getToken();
    if (!token) return;
    setName(employerAuth.getUser()?.name ?? '');
    Promise.all([
      employerApi.getStats(token),
      subscriptionApi.getEmployerStatus(token).catch(() => null),
    ])
      .then(([statsRes, subRes]) => {
        setStats(statsRes.data);
        setSub(subRes?.data ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeJobs  = stats?.activeJobs ?? 0;
  const totalJobs   = stats?.totalJobs ?? 0;
  const newToday    = stats?.newApplications ?? 0;
  const hired       = stats?.hired ?? 0;

  const cards = [
    { href: '/employer/jobs',         label: 'Active Jobs',  value: activeJobs, icon: HiBriefcase,     accent: '#7C3AED', tint: '#EDE9FE' },
    { href: '/employer/applications', label: 'Applications', value: stats?.totalApplications ?? 0, icon: HiUserGroup, accent: '#2563EB', tint: '#DBEAFE' },
    { href: '/employer/applications', label: 'New Today',    value: newToday,   icon: HiBell,          accent: '#D97706', tint: '#FEF3C7' },
    { href: '/employer/applications', label: 'Hired',        value: hired,      icon: HiCheckCircle,   accent: '#059669', tint: '#D1FAE5' },
  ];

  const quickActions = [
    { href: '/employer/post-job',   label: 'Post Job',   icon: HiPlusCircle,    accent: '#7C3AED', tint: '#EDE9FE' },
    { href: '/employer/applications', label: 'Applicants', icon: HiUserGroup,   accent: '#2563EB', tint: '#DBEAFE' },
    { href: '/employer/jobs',       label: 'My Jobs',    icon: HiBriefcase,     accent: '#059669', tint: '#D1FAE5' },
    { href: '/employer/persons',    label: 'Persons',    icon: HiUserGroup,     accent: '#0EA5E9', tint: '#E0F2FE' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between flex-wrap gap-4 animate-fade-in-up">
        <div>
          <p className="text-slate-400 text-sm">{greeting()} 👋</p>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{name || 'Employer'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <HiBell className="w-5 h-5" />
          </button>
          <Link href="/employer/post-job" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-warm hover-lift transition-all" style={{ backgroundColor: COLOR }}>
            <HiPlusCircle className="w-4 h-4" /> Post Job
          </Link>
        </div>
      </div>

      <div className="px-6">
        {!loading && sub && sub.status !== 'subscribed' && (
          <div className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 mb-6 border" style={{ backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FDE68A' }}>
                <HiBriefcase className="w-4.5 h-4.5" style={{ color: '#B45309' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#B45309' }}>
                  {Math.max((sub.free_limit ?? 0) - (sub.job_count ?? 0), 0)} free job postings remaining
                </p>
                <p className="text-xs" style={{ color: '#B45309', opacity: 0.8 }}>
                  {sub.job_count ?? 0}/{sub.free_limit ?? 0} used · Subscribe for unlimited
                </p>
              </div>
            </div>
            <HiChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#B45309' }} />
          </div>
        )}

        {loading ? (
          <div className="text-slate-400 text-sm">Loading…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((c, i) => (
              <ScrollReveal key={c.label} animation="fade-up" delay={i * 90}>
                <Link href={c.href} className="block rounded-2xl p-5 bg-white border border-slate-100 shadow-warm-lg hover-lift hover:border-violet-100 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.tint }}>
                      <c.icon className="w-5 h-5" style={{ color: c.accent }} />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{c.value}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-slate-400">{c.label}</p>
                    <HiChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <h2 className="text-base font-extrabold text-slate-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {quickActions.map((a, i) => (
            <ScrollReveal key={a.href + a.label} animation="fade-up" delay={i * 60}>
              <Link href={a.href} className="flex flex-col items-center gap-2 text-center hover-lift transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: a.tint }}>
                  <a.icon className="w-6 h-6" style={{ color: a.accent }} />
                </div>
                <span className="text-xs font-semibold text-slate-600">{a.label}</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {!loading && totalJobs === 0 && (
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col items-center text-center bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#EDE9FE' }}>
                <HiOutlineBriefcase className="w-8 h-8" style={{ color: COLOR }} />
              </div>
              <p className="font-extrabold text-slate-800 mb-1">Start hiring today</p>
              <p className="text-sm text-slate-400 mb-5 max-w-xs">Post your first job and start receiving applications</p>
              <Link href="/employer/post-job" className="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-warm hover-lift transition-all" style={{ backgroundColor: COLOR }}>
                Post Your First Job
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
