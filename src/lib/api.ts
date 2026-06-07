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
