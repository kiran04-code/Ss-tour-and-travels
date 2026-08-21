export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export class ApiClientError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = "ApiClientError"; this.status = status; }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("ssToursAdminToken");
  const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }, ...options });
  const body = await response.json().catch(() => null) as { success?: boolean; message?: string; data?: T } | null;
  if (!response.ok || !body?.success) throw new ApiClientError(body?.message || "Request failed", response.status);
  return body.data as T;
}
