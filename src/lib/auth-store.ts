// ─── Admin Authentication Store ─────────────────────────────────────────────
// Handles admin password setup, validation, login/logout.
// Password is hashed before storage for basic client-side security.

const PASSWORD_KEY = "abhishek_portfolio_admin_pw";
const AUTH_SESSION_KEY = "admin_auth";

// ─── Password Validation ────────────────────────────────────────────────────

export type PasswordError = {
  length: boolean;
  letter: boolean;
  number: boolean;
  special: boolean;
};

/**
 * Validates password strength.
 * Returns an object indicating which rules pass (true = valid).
 */
export function validatePassword(password: string): PasswordError {
  return {
    length: password.length > 6,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
  };
}

/**
 * Returns true if all password rules pass.
 */
export function isPasswordValid(password: string): boolean {
  const v = validatePassword(password);
  return v.length && v.letter && v.number && v.special;
}

// ─── Hashing (SHA-256, browser-native) ──────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_portfolio_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Password Management ────────────────────────────────────────────────────

const ADMIN_AUTH_DATA_KEY = "abhishek_portfolio_admin_data";

export type AdminAuthData = {
  username: string;
  email: string;
  hash: string;
};

/**
 * Check if admin credentials have been set up.
 */
export function isAuthSetUp(): boolean {
  return !!localStorage.getItem(ADMIN_AUTH_DATA_KEY);
}

/**
 * Set (or change) the admin credentials.
 * Returns false if the password doesn't meet strength requirements.
 */
export async function setAdminCredentials(username: string, email: string, password: string): Promise<boolean> {
  if (!isPasswordValid(password) || !username || !email) return false;
  const hashed = await hashPassword(password);
  const data: AdminAuthData = { username, email, hash: hashed };
  localStorage.setItem(ADMIN_AUTH_DATA_KEY, JSON.stringify(data));
  return true;
}

/**
 * Verify a login attempt against the stored credentials.
 */
export async function verifyCredentials(username: string, email: string, password: string): Promise<boolean> {
  const storedStr = localStorage.getItem(ADMIN_AUTH_DATA_KEY);
  if (!storedStr) return false;
  try {
    const stored = JSON.parse(storedStr) as AdminAuthData;
    if (stored.username !== username || stored.email !== email) return false;
    const hashed = await hashPassword(password);
    return hashed === stored.hash;
  } catch {
    return false;
  }
}

// ─── Session Management ─────────────────────────────────────────────────────

/**
 * Check if the admin is currently logged in (session-based).
 */
export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
}

/**
 * Mark the admin as logged in for this session.
 */
export function loginAdmin(): void {
  sessionStorage.setItem(AUTH_SESSION_KEY, "1");
}

/**
 * Log out the admin (clears session).
 */
export function logoutAdmin(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
export const isPasswordSetUp = isAuthSetUp;

export async function setAdminPassword(pwd: string): Promise<boolean> {
  if (!isPasswordValid(pwd)) return false;
  const hashed = await hashPassword(pwd);
  const data = JSON.stringify({ hash: hashed });
  localStorage.setItem(ADMIN_AUTH_DATA_KEY, data);
  return true;
}

export async function verifyPassword(pwd: string): Promise<boolean> {
  const storedStr = localStorage.getItem(ADMIN_AUTH_DATA_KEY);
  if (!storedStr) return false;
  const stored = JSON.parse(storedStr) as { hash: string };
  const hashed = await hashPassword(pwd);
  return hashed === stored.hash;
}
