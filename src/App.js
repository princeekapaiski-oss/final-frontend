import { useState, useEffect } from "react";
import "./App.css";

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import MainScreen from "./screens/MainScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AchievementsScreen from "./screens/AchievementsScreen";
import LoadingScreen from "./components/LoadingScreen";
import { useUser } from "./context/UserContext";

function App() {
  const [screen, setScreen] = useState("loading");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const {
    loading,
    error,
    isAuthenticated,
    needsRegistration,
    tryTelegramAuth,
  } = useUser();

  // Инициализация
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Отправка уведомления при старте
      tg.showAlert("🚀 Приложение запущено! Добро пожаловать!");
    }

    // Пробуем авто-авторизацию через Telegram
    tryTelegramAuth().then((result) => {
      switch (result) {
        case "ok":
          setScreen("main");
          break;
        case "needsRegistration":
          setScreen("registration");
          break;
        case "noTelegram":
          // Не в Telegram — показываем логин
          setScreen("login");
          break;
        default:
          // Ошибка — показываем логин
          setScreen("login");
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Переход на главную после успешного логина/регистрации
  const onAuthSuccess = () => {
    setScreen("main");
  };

  // Навигация с анимацией перехода
  const go = (target) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setIsTransitioning(false);
    }, 300);
  };

  // Экран загрузки
  if (screen === "loading" || (loading && !isAuthenticated) || isTransitioning) {
    return <LoadingScreen message={isTransitioning ? "ПЕРЕХОД..." : "ЗАГРУЗКА..."} />;
  }

  const renderScreen = () => {
    switch (screen) {
      case "login":
        return <LoginScreen go={go} onAuthSuccess={onAuthSuccess} />;
      case "registration":
        return <RegistrationScreen go={go} onAuthSuccess={onAuthSuccess} />;
      case "main":
        return <MainScreen go={go} />;
      case "schedule":
        return <ScheduleScreen go={go} />;
      case "profile":
        return <ProfileScreen go={go} />;
      case "achievements":
        return <AchievementsScreen go={go} />;
      default:
        return <MainScreen go={go} />;
    }
  };

  return (
    <div className="app-viewport">
      <div className="app-root">{renderScreen()}</div>
    </div>
  );
}

export default App;
