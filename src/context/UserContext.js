import { createContext, useContext, useState, useCallback } from "react";
import {
  authTelegram,
  authDev,
  login as apiLogin,
  register as apiRegister,
  fetchMe,
  isLoggedIn,
  logout as apiLogout,
  getTelegramInitData,
} from "../utils/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Если Telegram initData есть, но пользователь не зарегистрирован
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);

  /**
   * Попытка авто-входа через Telegram.
   * Возвращает: "ok" | "needsRegistration" | "noTelegram"
   */
  const tryTelegramAuth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const initData = getTelegramInitData();

      if (!initData) {
        // Не в Telegram — нужен обычный логин
        setLoading(false);
        return "noTelegram";
      }

      const result = await authTelegram(initData);

      if (result.needsRegistration) {
        // Пользователь есть в Telegram, но ещё не зарегистрирован
        setNeedsRegistration(true);
        setTelegramUser(result.telegramUser);
        setLoading(false);
        return "needsRegistration";
      }

      // Успешно — загружаем профиль
      const profile = await fetchMe();
      setUser(profile);
      setLoading(false);
      return "ok";
    } catch (err) {
      console.error("Telegram auth error:", err);
      setError(err.message);
      setLoading(false);
      return "error";
    }
  }, []);

  /**
   * Вход по email + пароль.
   */
  const loginWithEmail = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await apiLogin({ email, password });
      const profile = await fetchMe();
      setUser(profile);
      setNeedsRegistration(false);
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Регистрация.
   */
  const registerUser = useCallback(async ({ firstName, lastName, email, password, confirmPassword }) => {
    setLoading(true);
    setError(null);

    try {
      const initData = getTelegramInitData();
      await apiRegister({ firstName, lastName, email, password, confirmPassword, initData });
      const profile = await fetchMe();
      setUser(profile);
      setNeedsRegistration(false);
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * DEV-вход (без Telegram).
   */
  const devLogin = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authDev();
      const profile = await fetchMe();
      setUser(profile);
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Обновить профиль.
   */
  const refreshUser = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const profile = await fetchMe();
      setUser(profile);
    } catch (err) {
      console.error("Refresh error:", err);
    }
  }, []);

  /**
   * Выход.
   */
  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setNeedsRegistration(false);
    setTelegramUser(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        setError,
        needsRegistration,
        telegramUser,
        tryTelegramAuth,
        loginWithEmail,
        registerUser,
        devLogin,
        refreshUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
