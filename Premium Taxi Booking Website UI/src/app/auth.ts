export const AUTH_TOKEN_KEY = "ssToursAdminToken";
export const AUTH_USER_KEY = "ssToursAdminUser";
export const ADMIN_API_TOKEN_VALUE = "demo-token-ss-tours-2026";

// Client-based credential verification
const VALID_USERNAMES = ["admin", "sstours", "admin@sstours.in", "owner", "ss-tours"];
const VALID_PASSWORDS = ["Admin@123", "admin123", "Admin123", "admin@123", "sstours@2026", "sssolapur", "admin"];

export function verifyClientCredentials(username: string, pass: string): boolean {
  const cleanUser = username.trim().toLowerCase();
  const isUserValid = VALID_USERNAMES.includes(cleanUser);
  const isPassValid = VALID_PASSWORDS.includes(pass.trim());
  return isUserValid && isPassValid;
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

