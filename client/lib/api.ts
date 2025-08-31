export interface ApiOptions extends RequestInit {
  auth?: boolean;
}

const API_BASE = "/api";
let apiAvailable: boolean | null = null;

export async function isApiAvailable(): Promise<boolean> {
  if (apiAvailable !== null) return apiAvailable;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${API_BASE}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    apiAvailable = res.ok;
  } catch {
    apiAvailable = false;
  }
  return apiAvailable;
}

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (options.auth) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("kk_token") : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (e: any) {
    throw new Error(
      "Network error. Please check your connection and try again.",
    );
  }
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
