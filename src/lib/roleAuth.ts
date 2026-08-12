// Generic localStorage session helper, parameterized by role prefix.
// Keeps employer and jobseeker sessions fully independent from each other and from admin.

export interface RoleUser {
  userId: string;
  name?:  string;
  role?:  string;
}

function makeAuth(prefix: string) {
  const TOKEN_KEY = `${prefix}_token`;
  const USER_KEY  = `${prefix}_user`;

  return {
    getToken(): string | null {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(TOKEN_KEY);
    },
    saveSession(token: string, user: RoleUser): void {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearSession(): void {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    getUser(): RoleUser | null {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    },
  };
}

export const employerAuth    = makeAuth('employer');
export const jobseekerAuth   = makeAuth('jobseeker');
export const advertiserAuth  = makeAuth('advertiser');
