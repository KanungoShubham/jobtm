const BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

if (!BASE) throw new Error('NEXT_PUBLIC_API_URL is not set in .env.local');

async function req<T>(method: string, path: string, body?: object, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

// ── Auth ──────────────────────────────────────────────────────
export const adminAuthApi = {
  sendOtp:   (mobile: string) =>
    req('POST', '/api/auth/send-otp', { mobile }),

  verifyOtp: (mobile: string, otp: string) =>
    req<{ token: string; role: string }>('POST', '/api/auth/verify-otp', { mobile, otp, role: 'admin' }),

  loginPassword: (mobile: string, password: string) =>
    req<{ token: string; userId: string; role: string; name?: string }>(
      'POST', '/api/auth/login-password', { mobile, password }
    ),
};

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  getStats: (token: string) =>
    req<{ data: any }>('GET', '/api/admin/stats', undefined, token),
};

// ── Users ─────────────────────────────────────────────────────
export const usersApi = {
  list: (token: string, params?: { role?: string; status?: string; q?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.role)   qs.set('role',   params.role);
    if (params?.status) qs.set('status', params.status);
    if (params?.q)      qs.set('q',      params.q);
    if (params?.page)   qs.set('page',   String(params.page));
    const q = qs.toString();
    return req<{ data: any[]; total: number }>('GET', `/api/admin/users${q ? `?${q}` : ''}`, undefined, token);
  },

  get: (token: string, id: string) =>
    req<{ data: any }>('GET', `/api/admin/users/${id}`, undefined, token),

  updateStatus: (token: string, id: string, updates: { verify_status?: string; is_active?: boolean; note?: string }) =>
    req('PUT', `/api/admin/users/${id}/status`, updates, token),
};

// ── Companies ─────────────────────────────────────────────────
export const companiesApi = {
  list: (token: string, status = 'pending') =>
    req<{ data: any[] }>('GET', `/api/admin/companies?status=${status}`, undefined, token),

  verify: (token: string, id: string, action: 'approve' | 'reject', note?: string) =>
    req('PUT', `/api/admin/companies/${id}/verify`, { action, note }, token),
};

// ── Jobs ──────────────────────────────────────────────────────
export const jobsAdminApi = {
  list: (token: string, params?: { status?: string; q?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.q)      qs.set('q',      params.q);
    const q = qs.toString();
    return req<{ data: any[] }>('GET', `/api/admin/jobs${q ? `?${q}` : ''}`, undefined, token);
  },

  moderate: (token: string, id: string, status: string, note?: string) =>
    req('PUT', `/api/admin/jobs/${id}`, { status, note }, token),
};

// ── Audit log ─────────────────────────────────────────────────
export const auditApi = {
  list: (token: string) =>
    req<{ data: any[] }>('GET', '/api/admin/audit-log', undefined, token),
};

// ── Launch Offer settings ─────────────────────────────────────
export const launchOfferApi = {
  get: (token: string) =>
    req<{ data: any }>('GET', '/api/admin/launch-offer', undefined, token),

  update: (token: string, data: { is_enabled?: boolean; registration_limit?: number }) =>
    req<{ data: any }>('PUT', '/api/admin/launch-offer', data, token),
};

// ── Plan Settings ─────────────────────────────────────────────
export const planSettingsApi = {
  list: (token: string) =>
    req<{ data: any[] }>('GET', '/api/admin/plan-settings', undefined, token),

  update: (token: string, id: string, amount: number) =>
    req<{ data: any }>('PUT', `/api/admin/plan-settings/${id}`, { amount }, token),
};

// ── Coupons ───────────────────────────────────────────────────
export const couponsAdminApi = {
  stats: (token: string) =>
    req<{ data: any }>('GET', '/api/admin/coupon-stats', undefined, token),

  list: (token: string, params?: { category?: string; active?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.active)   qs.set('active',   params.active);
    if (params?.page)     qs.set('page',     String(params.page));
    const q = qs.toString();
    return req<{ data: any[]; total: number }>(
      'GET', `/api/admin/coupons${q ? `?${q}` : ''}`, undefined, token
    );
  },

  create: (token: string, data: object) =>
    req<{ data: any }>('POST', '/api/admin/coupons', data, token),

  update: (token: string, id: string, data: object) =>
    req<{ data: any }>('PUT', `/api/admin/coupons/${id}`, data, token),
};

// ── Activities (Extra Curricular) ─────────────────────────────
export const activitiesAdminApi = {
  list: (token: string, params?: { status?: string; category?: string; q?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status)   qs.set('status',   params.status);
    if (params?.category) qs.set('category', params.category);
    if (params?.q)        qs.set('q',        params.q);
    const q = qs.toString();
    return req<{ data: any[] }>('GET', `/api/admin/activities${q ? `?${q}` : ''}`, undefined, token);
  },

  verify: (token: string, id: string, action: 'approve' | 'reject', note?: string) =>
    req('PUT', `/api/admin/activities/${id}/verify`, { action, note }, token),

  getPayments: (token: string, params?: { payout_status?: string }) => {
    const qs = params?.payout_status ? `?payout_status=${params.payout_status}` : '';
    return req<{ data: any[] }>('GET', `/api/admin/activity-payments${qs}`, undefined, token);
  },

  releasePayout: (token: string, bookingId: string) =>
    req<{ data: any }>('POST', `/api/admin/activity-payments/${bookingId}/release`, {}, token),
};

// ── Ads (Advertisement Banners) ───────────────────────────────
export const adsAdminApi = {
  list: (token: string, status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return req<{ data: any[] }>('GET', `/api/admin/ads${qs}`, undefined, token);
  },
  verify: (token: string, id: string, action: 'approve' | 'reject', note?: string) =>
    req('PUT', `/api/admin/ads/${id}/verify`, { action, note }, token),

  // Advertiser (business) profiles
  listAdvertisers: (token: string, status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return req<{ data: any[] }>('GET', `/api/admin/advertisers${qs}`, undefined, token);
  },
  verifyAdvertiser: (token: string, id: string, action: 'approve' | 'reject', note?: string) =>
    req('PUT', `/api/admin/advertisers/${id}/verify`, { action, note }, token),

  // Ad Center duration plans (admin-managed price & duration)
  listPlans: (token: string) =>
    req<{ data: AdPlan[] }>('GET', '/api/admin/ad-plans', undefined, token),
  createPlan: (token: string, body: AdPlanInput) =>
    req<{ data: AdPlan }>('POST', '/api/admin/ad-plans', body, token),
  updatePlan: (token: string, key: string, body: Partial<AdPlanInput>) =>
    req<{ data: AdPlan }>('PUT', `/api/admin/ad-plans/${key}`, body, token),
  deletePlan: (token: string, key: string) =>
    req<{ success: boolean }>('DELETE', `/api/admin/ad-plans/${key}`, undefined, token),
};

export interface AdPlan {
  key: string; label: string; days: number; amount: number;
  sort_order: number; is_active: boolean; created_at?: string; updated_at?: string;
}
export interface AdPlanInput {
  key: string; label: string; days: number; amount: number;
  sort_order?: number; is_active?: boolean;
}

// ── Subscriptions ─────────────────────────────────────────────
export const subscriptionsApi = {
  stats: (token: string) =>
    req<{ data: any }>('GET', '/api/admin/subscription-stats', undefined, token),

  list: (token: string, params?: { plan_type?: string; active?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.plan_type) qs.set('plan_type', params.plan_type);
    if (params?.active)    qs.set('active',    params.active);
    if (params?.page)      qs.set('page',      String(params.page));
    const q = qs.toString();
    return req<{ data: any[]; total: number }>(
      'GET', `/api/admin/subscriptions${q ? `?${q}` : ''}`, undefined, token
    );
  },
};
