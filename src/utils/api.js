// src/utils/api.js

// ВАЖНО: в Vercel/Render добавьте переменную REACT_APP_API_URL
// Значение: https://ВАШ-BACKEND.onrender.com  (без слеша в конце!)
const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || "";

if (!API_URL) {
  console.error(
    "[api.js] REACT_APP_API_URL не задан! " +
    "Добавьте переменную окружения в настройках Static Site на Render."
  );
}

// ─────── helpers ───────

function getToken() {
  return localStorage.getItem("accessToken");
}

function setToken(token) {
  localStorage.setItem("accessToken", token);
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: authHeaders(),
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─────── Auth ───────

/**
 * Попытка авторизации через Telegram initData.
 * Если пользователь не зарегистрирован — вернёт { needsRegistration: true, telegramUser }.
 * Если зарегистрирован — вернёт { accessToken, user }.
 */
export async function authTelegram(initData) {
  const data = await request("/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ initData }),
  });

  if (data.accessToken) {
    setToken(data.accessToken);
  }

  return data;
}

/**
 * Регистрация: email + пароль + имя + (опционально) Telegram initData.
 */
export async function register({ firstName, lastName, email, password, confirmPassword, initData }) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, password, confirmPassword, initData }),
  });

  if (data.accessToken) {
    setToken(data.accessToken);
  }

  return data;
}

/**
 * Вход по email + пароль.
 */
export async function login({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.accessToken) {
    setToken(data.accessToken);
  }

  return data;
}

/**
 * DEV-авторизация (без Telegram, для локальной разработки).
 */
export async function authDev() {
  const data = await request("/auth/dev", { method: "POST" });

  if (data.accessToken) {
    setToken(data.accessToken);
  }

  return data;
}

// ─────── Me ───────

export async function fetchMe() {
  return request("/me");
}

export async function updateMe(body) {
  return request("/me", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// ─────── Activities ───────

export async function fetchActivities() {
  return request("/activities");
}

export async function registerForActivity(activityId) {
  return request(`/activities/${activityId}/register`, { method: "POST" });
}

export async function cancelActivity(activityId) {
  return request(`/activities/${activityId}/cancel`, { method: "POST" });
}

// ─────── Achievements ───────

export async function fetchMyAchievements() {
  return request("/achievements/my");
}

/** Все достижения + флаг unlocked (полученные идут первыми) */
export async function fetchAllAchievements() {
  return request("/achievements/all");
}

// ─────── Utils ───────

export function isLoggedIn() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("accessToken");
}

export function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || null;
}

export function isTelegramWebApp() {
  return !!window.Telegram?.WebApp?.initData;
}

export { API_URL };
