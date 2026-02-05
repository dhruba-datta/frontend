/**
 * API Client for TalentX Backend
 * All communication with the backend REST API goes through here
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Token storage key
const TOKEN_KEY = 'talentx_token';

/**
 * Get stored JWT token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store JWT token (in localStorage + cookie for SSR middleware)
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  // Also set as cookie for middleware to read during SSR
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secureFlag}`; // 7 days
}

/**
 * Clear stored token (logout)
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  // Also clear the cookie
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ============ Auth API ============

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'EMPLOYER' | 'TALENT';
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  role: 'EMPLOYER' | 'TALENT';
}): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setToken(response.token);
  return response;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setToken(response.token);
  return response;
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/auth/me');
}

export function logout(): void {
  clearToken();
}

// ============ Jobs API (Public) ============

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  company_name: string;
  tech_stack: string;
  deadline: string;
  jd_text?: string;
  applications_count: number;
  created_at: string;
  employer_name?: string;
  match_score?: number;
}

export async function getJobs(search?: string): Promise<Job[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest<Job[]>(`/jobs${query}`);
}

export async function getJob(id: string): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`);
}

// ============ Employer API ============

export async function createJob(data: {
  title: string;
  company_name: string;
  tech_stack: string;
  deadline: string;
}): Promise<Job> {
  return apiRequest<Job>('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getEmployerJobs(): Promise<Job[]> {
  return apiRequest<Job[]>('/jobs/employer/list');
}

export interface Applicant {
  id: string;
  talent_id: string;
  name: string;
  email: string;
  source: 'manual' | 'invitation';
  created_at: string;
}

export async function getApplicants(jobId: string): Promise<Applicant[]> {
  return apiRequest<Applicant[]>(`/jobs/${jobId}/applicants`);
}

export interface MatchedTalent {
  id: string;
  name: string;
  email: string;
  score: number;
}

export async function getMatches(jobId: string): Promise<MatchedTalent[]> {
  return apiRequest<MatchedTalent[]>(`/jobs/${jobId}/matches`);
}

export interface Invitation {
  id: string;
  job_id: string;
  employer_id: string;
  talent_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
  responded_at?: string;
  title?: string;
  company_name?: string;
  deadline?: string;
  employer_name?: string;
}

export async function inviteTalent(jobId: string, talentId: string): Promise<Invitation> {
  return apiRequest<Invitation>(`/jobs/${jobId}/invitations`, {
    method: 'POST',
    body: JSON.stringify({ talent_id: talentId }),
  });
}

// ============ Talent API ============

export async function applyToJob(jobId: string): Promise<{ application: any; message: string }> {
  return apiRequest<{ application: any; message: string }>(`/talent/jobs/${jobId}/apply`, {
    method: 'POST',
  });
}

export async function getTalentFeed(): Promise<Job[]> {
  return apiRequest<Job[]>('/talent/feed');
}

export async function getTalentInvitations(): Promise<Invitation[]> {
  return apiRequest<Invitation[]>('/talent/invitations');
}

export async function respondToInvitation(
  invitationId: string,
  status: 'ACCEPTED' | 'DECLINED'
): Promise<Invitation> {
  return apiRequest<Invitation>(`/talent/invitations/${invitationId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export interface Application {
  id: string;
  job_id: string;
  talent_id: string;
  source: 'manual' | 'invitation';
  created_at: string;
  title: string;
  company_name: string;
  deadline: string;
}

export async function getTalentApplications(): Promise<Application[]> {
  return apiRequest<Application[]>('/talent/applications');
}
