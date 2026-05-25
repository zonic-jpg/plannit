"use client";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const USERS_KEY = "rubba_users";
const SESSION_KEY = "rubba_session";

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function register(
  name: string,
  email: string,
  password: string
): { ok: true; user: User } | { ok: false; error: string } {
  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const isFirst = users.length === 0;
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    isAdmin: isFirst,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  const passwords = JSON.parse(localStorage.getItem("rubba_pw") || "{}");
  passwords[email] = password;
  localStorage.setItem("rubba_pw", JSON.stringify(passwords));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function login(
  email: string,
  password: string
): { ok: true; user: User } | { ok: false; error: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { ok: false, error: "No account found with this email." };
  const passwords = JSON.parse(localStorage.getItem("rubba_pw") || "{}");
  if (passwords[email] !== password) {
    return { ok: false, error: "Incorrect password." };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
