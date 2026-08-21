export const AUTH_TOKEN_KEY = "ssToursAdminToken";
export const AUTH_USER_KEY = "ssToursAdminUser";

// Client-side demo credentials only. They are not secure and must be replaced
// with server-side authentication before using this in production.
export const DEMO_CREDENTIALS = {
  username: "admin",
  email: "admin@sstours.in",
  password: "Admin@123",
};

export function isAuthenticated() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

export function signOut() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}
