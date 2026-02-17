import { useState, useEffect, useRef } from "react";
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
  // Флаг: инициализация ещё не завершена (первый запуск)
  const isInitializing = useRef(true);

  const {
    loading,
    isAuthenticated,
    tryTelegramAuth,
  } = useUser();

  // Инициализация один раз при монтировании
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }

    tryTelegramAuth().then((result) => {
      isInitializing.current = false;
      switch (result) {
        case "ok":
          setScreen("main");
          break;
        case "needsRegistration":
          setScreen("registration");
          break;
        default:
          setScreen("login");
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Переход на главную после успешного логина/регистрации
  const onAuthSuccess = () => {
    setScreen("main");
  };

  // Навигация с анимацией — только между основными экранами (не логин/регистрация)
  const go = (target) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(target);
      setIsTransitioning(false);
    }, 300);
  };

  // Показываем LoadingScreen только при инициализации или при переходе между страницами
  // НЕ показываем во время логина/регистрации (иначе экран очищается)
  const showLoader = screen === "loading" || isTransitioning;

  if (showLoader) {
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
