# jobstm Admin Website — API Setup

## Add to your .env.local

```
# URL of your Node.js API on Hostinger
NEXT_PUBLIC_API_URL=https://jobstm-api.jobstm.co/
```

## How it works

This admin website calls the same `jobstm-api` that the mobile app uses.
No Supabase keys needed here — the API handles all database operations.

## Usage in components / pages

```ts
import { dashboardApi, usersApi, companiesApi } from '@/lib/api';

// Get admin JWT token from your auth session (NextAuth or cookie)
const token = session.accessToken;

// Fetch dashboard stats
const { data } = await dashboardApi.getStats(token);

// List pending companies
const { data: companies } = await companiesApi.list(token, 'pending');

// Approve a company
await companiesApi.verify(token, companyId, 'approve');

// List users
const { data: users, total } = await usersApi.list(token, { role: 'jobseeker', page: 1 });
```

## API Endpoints available for admin

| Action | Call |
|--------|------|
| Dashboard stats | `dashboardApi.getStats(token)` |
| List users | `usersApi.list(token, { role, status, q })` |
| User detail | `usersApi.get(token, id)` |
| Approve/suspend user | `usersApi.updateStatus(token, id, { verify_status })` |
| Pending companies | `companiesApi.list(token, 'pending')` |
| Approve company | `companiesApi.verify(token, id, 'approve')` |
| Reject company | `companiesApi.verify(token, id, 'reject', 'reason')` |
| All jobs | `jobsAdminApi.list(token)` |
| Remove job | `jobsAdminApi.moderate(token, id, 'expired')` |
| Audit log | `auditApi.list(token)` |
