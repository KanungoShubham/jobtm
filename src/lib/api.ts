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

// ── Public (no auth) ────────────────────────────────────────────
export const publicApi = {
  getStats: () =>
    req<{ data: {
      total_jobs: number; total_jobseekers: number; total_companies: number;
      launch_offer: {
        is_active: boolean; is_enabled: boolean; registration_limit: number;
        registered: number; remaining: number; fill_pct: number;
      };
    } }>('GET', '/api/public/stats'),
};

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
  list: (token: string, params?: { role?: string; status?: string; q?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.role)   qs.set('role',   params.role);
    if (params?.status) qs.set('status', params.status);
    if (params?.q)      qs.set('q',      params.q);
    qs.set('page',  String(params?.page  ?? 1));
    qs.set('limit', String(params?.limit ?? 10));
    return req<{ data: any[]; total: number; page: number }>('GET', `/api/admin/users?${qs}`, undefined, token);
  },

  get: (token: string, id: string) =>
    req<{ data: any }>('GET', `/api/admin/users/${id}`, undefined, token),

  updateStatus: (token: string, id: string, updates: { verify_status?: string; is_active?: boolean; note?: string }) =>
    req('PUT', `/api/admin/users/${id}/status`, updates, token),
};

// ── Companies ─────────────────────────────────────────────────
export const companiesApi = {
  list: (token: string, status = 'pending', page = 1, limit = 10) => {
    const qs = new URLSearchParams({ status, page: String(page), limit: String(limit) });
    return req<{ data: any[]; total: number; page: number }>('GET', `/api/admin/companies?${qs}`, undefined, token);
  },

  verify: (token: string, id: string, action: 'approve' | 'reject', note?: string) =>
    req('PUT', `/api/admin/companies/${id}/verify`, { action, note }, token),
};

// ── Jobs ──────────────────────────────────────────────────────
export const jobsAdminApi = {
  list: (token: string, params?: { status?: string; q?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.q)      qs.set('q',      params.q);
    qs.set('page',  String(params?.page  ?? 1));
    qs.set('limit', String(params?.limit ?? 10));
    return req<{ data: any[]; total: number; page: number }>('GET', `/api/admin/jobs?${qs}`, undefined, token);
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
  list: (token: string, params?: { status?: string; category?: string; q?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status)   qs.set('status',   params.status);
    if (params?.category) qs.set('category', params.category);
    if (params?.q)        qs.set('q',        params.q);
    qs.set('page',  String(params?.page  ?? 1));
    qs.set('limit', String(params?.limit ?? 10));
    return req<{ data: any[]; total: number; page: number }>('GET', `/api/admin/activities?${qs}`, undefined, token);
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
  list: (token: string, status?: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    return req<{ data: any[]; total: number; page: number; limit: number }>(
      'GET', `/api/admin/ads?${params}`, undefined, token,
    );
  },
  verify: (token: string, id: string, action: 'approve' | 'reject', note?: string) =>
    req('PUT', `/api/admin/ads/${id}/verify`, { action, note }, token),

  // Advertiser (business) profiles
  listAdvertisers: (token: string, status?: string, page = 1, limit = 10) => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) qs.set('status', status);
    return req<{ data: any[]; total: number; page: number }>('GET', `/api/admin/advertisers?${qs}`, undefined, token);
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

// ── Shared Auth (employer + jobseeker) ─────────────────────────
export const authApi = {
  sendOtp: (mobile: string, register?: boolean) =>
    req('POST', '/api/auth/send-otp', { mobile, register }),

  verifyOtp: (mobile: string, otp: string, role: string, name?: string, password?: string) =>
    req<{ token: string; userId: string; role: string; isNew: boolean }>(
      'POST', '/api/auth/verify-otp', { mobile, otp, role, name, password }
    ),

  loginPassword: (mobile: string, password: string) =>
    req<{ token: string; userId: string; role: string; name?: string }>(
      'POST', '/api/auth/login-password', { mobile, password }
    ),

  registerEmployer: (data: object) =>
    req<{ token: string; userId: string; role: string; company: any; isNew: boolean }>(
      'POST', '/api/auth/register-employer', data
    ),

  // Web-only, no-OTP registration (mobile app is unaffected — it still uses send-otp/verify-otp)
  registerJobseekerWeb: (data: { full_name: string; mobile: string; password: string; email?: string; location?: string }) =>
    req<{ token: string; userId: string; role: string; isNew: boolean }>(
      'POST', '/api/auth/register-jobseeker-web', data
    ),

  registerEmployerWeb: (data: object) =>
    req<{ token: string; userId: string; role: string; company: any; isNew: boolean }>(
      'POST', '/api/auth/register-employer-web', data
    ),

  registerAdvertiser: (data: object) =>
    req<{ token: string; userId: string; role: string; isNew: boolean }>(
      'POST', '/api/auth/register-advertiser', data
    ),

  requestEmployerOtp: (mobile: string) =>
    req('POST', '/api/auth/request-employer-otp', { mobile }),

  checkEmployerOtp: (mobile: string, otp: string) =>
    req<{ success: boolean }>('POST', '/api/auth/check-employer-otp', { mobile, otp }),

  forgotPassword: (mobile: string) =>
    req('POST', '/api/auth/forgot-password', { mobile }),

  resetPassword: (mobile: string, otp: string, password: string) =>
    req<{ success: boolean; message: string }>('POST', '/api/auth/reset-password', { mobile, otp, password }),

  getProfile: (token: string) => req<{ data: any }>('GET', '/api/auth/profile', undefined, token),

  updateProfile: (token: string, data: { full_name?: string; email?: string; avatar_url?: string; headline?: string; location?: string }) =>
    req<{ data: any }>('PUT', '/api/auth/profile', data, token),
};

// ── Jobs (public + jobseeker) ───────────────────────────────────
export const jobsApi = {
  list: (params?: {
    q?: string; category?: string; type?: string; location?: string;
    remote?: boolean; urgent?: boolean; page?: number; limit?: number; sort?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.q)        qs.set('q',        params.q);
    if (params?.category) qs.set('category', params.category);
    if (params?.type)     qs.set('type',     params.type);
    if (params?.location) qs.set('location', params.location);
    if (params?.remote)   qs.set('remote',   'true');
    if (params?.urgent)   qs.set('urgent',   'true');
    if (params?.page)     qs.set('page',     String(params.page));
    if (params?.limit)    qs.set('limit',    String(params.limit));
    if (params?.sort)     qs.set('sort',     params.sort ?? 'latest');
    const q = qs.toString();
    return req<{ data: any[]; total: number }>('GET', `/api/jobs${q ? `?${q}` : ''}`);
  },

  get: (id: string) => req<{ data: any }>('GET', `/api/jobs/${id}`),

  apply: (token: string, id: string, data: { cover_note?: string; resume_url?: string }) =>
    req('POST', `/api/jobs/${id}/apply`, data, token),

  rate: (token: string, id: string, rating: number, review?: string) =>
    req('POST', `/api/jobs/${id}/rate`, { rating, review }, token),

  myApplications: (token: string) =>
    req<{ data: any[] }>('GET', '/api/jobs/my/applications', undefined, token),

  saveJob: (token: string, id: string) =>
    req<{ saved: boolean }>('POST', `/api/jobs/${id}/save`, undefined, token),

  savedList: (token: string) =>
    req<{ data: any[] }>('GET', '/api/jobs/saved/list', undefined, token),

  report: (token: string, id: string, report_type: string, description: string) =>
    req('POST', `/api/jobs/${id}/report`, { report_type, description }, token),
};

// ── Jobseeker profile ────────────────────────────────────────────
export const profileApi = {
  get: (token: string) => req<{ data: any }>('GET', '/api/profile', undefined, token),

  updateSkills: (token: string, skills: string[]) =>
    req('PUT', '/api/profile/skills', { skills }, token),

  addWork:    (token: string, data: object) => req('POST', '/api/profile/work', data, token),
  updateWork: (token: string, id: string, data: object) => req('PUT', `/api/profile/work/${id}`, data, token),
  deleteWork: (token: string, id: string) => req('DELETE', `/api/profile/work/${id}`, undefined, token),

  addEdu:    (token: string, data: object) => req('POST', '/api/profile/education', data, token),
  updateEdu: (token: string, id: string, data: object) => req('PUT', `/api/profile/education/${id}`, data, token),
  deleteEdu: (token: string, id: string) => req('DELETE', `/api/profile/education/${id}`, undefined, token),

  addProject:    (token: string, data: object) => req('POST', '/api/profile/projects', data, token),
  updateProject: (token: string, id: string, data: object) => req('PUT', `/api/profile/projects/${id}`, data, token),
  deleteProject: (token: string, id: string) => req('DELETE', `/api/profile/projects/${id}`, undefined, token),

  addCert:    (token: string, data: object) => req('POST', '/api/profile/certifications', data, token),
  updateCert: (token: string, id: string, data: object) => req('PUT', `/api/profile/certifications/${id}`, data, token),
  deleteCert: (token: string, id: string) => req('DELETE', `/api/profile/certifications/${id}`, undefined, token),

  addLang:    (token: string, data: object) => req('POST', '/api/profile/languages', data, token),
  updateLang: (token: string, id: string, data: object) => req('PUT', `/api/profile/languages/${id}`, data, token),
  deleteLang: (token: string, id: string) => req('DELETE', `/api/profile/languages/${id}`, undefined, token),

  updatePrefs:    (token: string, data: object) => req('PUT', '/api/profile/preferences', data, token),
  updatePersonal: (token: string, data: object) => req('PUT', '/api/profile/personal', data, token),
  updateSocial:   (token: string, data: object) => req('PUT', '/api/profile/social', data, token),

  milestones: (token: string) =>
    req<{ data: {
      total_completed: number; unique_companies: number; points: number;
      active_milestone: { jobs: number; label: string; progress: number; pct: number };
    } }>('GET', '/api/profile/milestones', undefined, token),
};

// ── Employer (company / persons / jobs / applications) ──────────
export const employerApi = {
  getCompany:    (token: string) => req<{ data: any }>('GET', '/api/employer/company', undefined, token),
  createCompany: (token: string, data: object) => req('POST', '/api/employer/company', data, token),
  updateCompany: (token: string, data: object) => req<{ data: any }>('PUT', '/api/employer/company', data, token),

  getPersons:   (token: string) => req<{ data: any[] }>('GET', '/api/employer/persons', undefined, token),
  addPerson:    (token: string, data: object) => req('POST', '/api/employer/persons', data, token),
  updatePerson: (token: string, id: string, data: object) => req('PUT', `/api/employer/persons/${id}`, data, token),
  deletePerson: (token: string, id: string) => req('DELETE', `/api/employer/persons/${id}`, undefined, token),

  getJobs: (token: string, status?: string, page = 1, limit = 10) => {
    const qs = new URLSearchParams();
    if (status && status !== 'all') qs.set('status', status);
    qs.set('page', String(page)); qs.set('limit', String(limit));
    return req<{ data: any[]; total: number }>('GET', `/api/employer/jobs?${qs.toString()}`, undefined, token);
  },
  createJob: (token: string, data: object) => req('POST', '/api/employer/jobs', data, token),
  updateJob: (token: string, id: string, data: object) => req('PUT', `/api/employer/jobs/${id}`, data, token),
  deleteJob: (token: string, id: string) => req('DELETE', `/api/employer/jobs/${id}`, undefined, token),

  getApplications: (token: string, jobId: string) =>
    req<{ data: any[] }>('GET', `/api/employer/jobs/${jobId}/applications`, undefined, token),
  getAllApplications: (token: string, status?: string, page = 1, limit = 10) => {
    const qs = new URLSearchParams();
    if (status && status !== 'all') qs.set('status', status);
    qs.set('page', String(page)); qs.set('limit', String(limit));
    return req<{ data: any[]; total: number }>('GET', `/api/employer/applications?${qs.toString()}`, undefined, token);
  },
  updateAppStatus: (token: string, appId: string, status: string) =>
    req('PUT', `/api/employer/applications/${appId}/status`, { status }, token),
  getApplicant: (token: string, id: string) =>
    req<{ data: any }>('GET', `/api/employer/applicant/${id}`, undefined, token),

  getStats: (token: string) => req<{ data: any }>('GET', '/api/employer/stats', undefined, token),
};

// ── Upload (base64 JSON) ─────────────────────────────────────────
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') { reject(new Error('Could not read file')); return; }
      const comma = reader.result.indexOf(',');
      resolve(comma >= 0 ? reader.result.slice(comma + 1) : reader.result);
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

async function base64Upload(path: string, file: File, token?: string): Promise<any> {
  const mime = file.type === 'image/jpg' ? 'image/jpeg' : file.type;
  const base64 = await readFileAsBase64(file);
  return req('POST', path, { file: base64, mimeType: mime, fileName: file.name }, token);
}

export const uploadApi = {
  resume: (token: string, file: File): Promise<{ data: any }> =>
    base64Upload('/api/upload/resume', file, token),

  deleteResume: (token: string, id: string) =>
    req('DELETE', `/api/upload/resume/${id}`, undefined, token),

  avatar: (token: string, file: File): Promise<{ url: string }> =>
    base64Upload('/api/upload/avatar', file, token),

  companyDoc: (file: File, type: 'pan' | 'cin' | 'logo', token?: string): Promise<{ url: string }> =>
    base64Upload(`/api/upload/company-doc?type=${type}`, file, token),

  aadhar: (token: string, file: File): Promise<{ url: string }> =>
    base64Upload('/api/upload/aadhar', file, token),

  activityImage: (token: string, file: File): Promise<{ url: string }> =>
    base64Upload('/api/upload/activity-image', file, token),

  adImage: (token: string, file: File): Promise<{ url: string }> =>
    base64Upload('/api/upload/ad-image', file, token),
};

// ── Subscriptions ─────────────────────────────────────────────
export const subscriptionsApi = {
  stats: (token: string) =>
    req<{ data: any }>('GET', '/api/admin/subscription-stats', undefined, token),

  list: (token: string, params?: { plan_type?: string; active?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.plan_type) qs.set('plan_type', params.plan_type);
    if (params?.active)    qs.set('active',    params.active);
    qs.set('page',  String(params?.page  ?? 1));
    qs.set('limit', String(params?.limit ?? 10));
    return req<{ data: any[]; total: number }>(
      'GET', `/api/admin/subscriptions?${qs}`, undefined, token
    );
  },
};

// ── Subscription (jobseeker/employer paywall) ─────────────────────
export const subscriptionApi = {
  getStatus: (token: string) =>
    req<{ data: any }>('GET', '/api/subscription/status', undefined, token),

  getEmployerStatus: (token: string) =>
    req<{ data: any }>('GET', '/api/subscription/employer-status', undefined, token),

  createOrder: (token: string, plan_type: string) =>
    req<{ data: any; plan: any; payment_url: string }>('POST', '/api/subscription/create-order', { plan_type }, token),

  billingHistory: (token: string) =>
    req<{ data: any[] }>('GET', '/api/subscription/billing-history', undefined, token),
};

// ── Ads / Ad Center (advertiser) ────────────────────────────────
export const adsApi = {
  plans: () => req<{ data: any[] }>('GET', '/api/ads/plans'),

  getAdvertiser: (token: string) => req<{ data: any }>('GET', '/api/ads/advertiser/me', undefined, token),

  registerOrUpdateAdvertiser: (token: string, data: object) =>
    req<{ data: any }>('POST', '/api/ads/advertiser', data, token),

  myAds: (token: string) => req<{ data: any[] }>('GET', '/api/ads/my', undefined, token),

  create: (token: string, data: { title: string; image_url: string; link_url?: string; plan_key: string }) =>
    req<{ data: any }>('POST', '/api/ads', data, token),

  createOrder: (token: string, adId: string) =>
    req<{ payment_url: string }>('POST', `/api/ads/${adId}/order`, undefined, token),

  checkStatus: (token: string, adId: string) =>
    req<{ data: any; paid: boolean }>('GET', `/api/ads/status/${adId}`, undefined, token),

  remove: (token: string, adId: string) =>
    req('DELETE', `/api/ads/${adId}`, undefined, token),
};

// ── Notifications ──────────────────────────────────────────────
export const notificationsApi = {
  list: (token: string) =>
    req<{ data: any[]; unread: number }>('GET', '/api/notifications', undefined, token),
  markRead: (token: string, id: string) =>
    req('PUT', `/api/notifications/${id}/read`, undefined, token),
  markAllRead: (token: string) =>
    req('PUT', '/api/notifications/read-all', undefined, token),
};

// ── Rewards (coupons / scratch cards) ────────────────────────────
export const rewardsApi = {
  list: (token: string, category?: string) => {
    const qs = category ? `?category=${category}` : '';
    return req<{ data: any[] }>('GET', `/api/rewards${qs}`, undefined, token);
  },
  scratch: (token: string, id: string) =>
    req<{ code: string; coupon: any; already_scratched?: boolean }>('POST', `/api/rewards/${id}/scratch`, undefined, token),
  use: (token: string, id: string) =>
    req<{ data: any }>('POST', `/api/rewards/${id}/use`, undefined, token),
};

// ── Referral (Refer & Earn) ───────────────────────────────────────
export const referralApi = {
  get: (token: string) =>
    req<{ data: {
      code: string; points: number; points_redeemed: number; referrals_count: number;
      redeemable: number; points_to_next: number; referrals: any[]; redemptions: any[];
    } }>('GET', '/api/referral', undefined, token),
  apply: (token: string, code: string) =>
    req<{ success: boolean; message: string }>('POST', '/api/referral/apply', { code }, token),
  redeem: (token: string) =>
    req<{ success: boolean; message: string }>('POST', '/api/referral/redeem', undefined, token),
};

// ── Activities (Extra Curricular) ───────────────────────────────
export const activitiesApi = {
  list: (params?: { category?: string; q?: string; location?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.q)        qs.set('q', params.q);
    if (params?.location) qs.set('location', params.location);
    if (params?.page)     qs.set('page', String(params.page));
    if (params?.limit)    qs.set('limit', String(params.limit));
    const q = qs.toString();
    return req<{ data: any[]; total: number }>('GET', `/api/activities${q ? `?${q}` : ''}`);
  },

  book: (token: string, activityId: string, data: { session_dates: string[]; batch_id?: string }) =>
    req<{ data: any; skipped?: string[] }>('POST', `/api/activities/${activityId}/book`, data, token),

  myList: (token: string) =>
    req<{ data: any[] }>('GET', '/api/activities/my', undefined, token),

  create: (token: string, data: object) =>
    req<{ data: any }>('POST', '/api/activities', data, token),

  update: (token: string, id: string, data: object) =>
    req<{ data: any }>('PUT', `/api/activities/${id}`, data, token),

  delete: (token: string, id: string) =>
    req('DELETE', `/api/activities/${id}`, undefined, token),

  createBatch: (token: string, id: string, data: object) =>
    req<{ data: any }>('POST', `/api/activities/${id}/batches`, data, token),

  updateBatch: (token: string, id: string, batchId: string, data: object) =>
    req<{ data: any }>('PUT', `/api/activities/${id}/batches/${batchId}`, data, token),

  deleteBatch: (token: string, id: string, batchId: string) =>
    req('DELETE', `/api/activities/${id}/batches/${batchId}`, undefined, token),

  bookings: (token: string, id: string) =>
    req<{ data: any[] }>('GET', `/api/activities/${id}/bookings`, undefined, token),

  myBookings: (token: string) =>
    req<{ data: any[] }>('GET', '/api/activities/bookings/my', undefined, token),
};

// ── Activity Payments (Razorpay Payment Link) ────────────────────
export const activityPaymentsApi = {
  createOrder: (token: string, data: { activity_id: string; session_dates: string[]; seats?: number; batch_id?: string }) =>
    req<{ data: any; payment_url: string }>('POST', '/api/payments/activity/order', data, token),

  checkBooking: (token: string, activityId: string, sessionDates: string[]) =>
    req<{ data: any[]; booked: boolean }>(
      'GET',
      `/api/payments/activity/booking-status?activity_id=${encodeURIComponent(activityId)}&session_dates=${encodeURIComponent(JSON.stringify(sessionDates))}`,
      undefined, token,
    ),
};
