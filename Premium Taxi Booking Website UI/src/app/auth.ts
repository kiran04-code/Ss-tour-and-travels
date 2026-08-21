export const AUTH_TOKEN_KEY = "ssToursAdminToken";
export const AUTH_USER_KEY = "ssToursAdminUser";
export const ADMIN_API_TOKEN_VALUE = "demo-token-ss-tours-2026";

// Admin credentials
const ADMIN_USERNAME = "Siddhant@2370";
const ADMIN_PASSWORD = "Sakhare@4111";

export function verifyClientCredentials(username: string, pass: string): boolean {
  const cleanUser = username.trim();
  const cleanPass = pass.trim();
  
  return cleanUser.toLowerCase() === ADMIN_USERNAME.toLowerCase() && cleanPass === ADMIN_PASSWORD;
}

export function loginAdmin(username: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, ADMIN_API_TOKEN_VALUE);
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      username: username.trim(),
      loggedInAt: new Date().toISOString()
    })
  );
}

export function isAuthenticated(): boolean {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return Boolean(token && token.trim().length > 0);
  } catch {
    return false;
  }
}

export function signOut(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // Ignore storage errors
  }
}

