import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import AchievementCard from "../components/AchievementCard/AchievementCard";
import "./AchievementsScreen.css";

import { useUser } from "../context/UserContext";
import { fetchMyAchievements } from "../utils/api";
import { LEVELS, getCurrentLevel, getProgressPercent } from "../utils/levels";

function AchievementsScreen({ go }) {
  const { user } = useUser();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentLevel = getCurrentLevel(LEVELS, user?.experience || 0);
  const progressPercent = getProgressPercent(LEVELS, user?.experience || 0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyAchievements();
        const mapped = data.map((a) => ({
          id: a.id,
          title: a.title?.toUpperCase() || "",
          description: a.description?.toUpperCase() || "",
          reward: `+${a.experience} ОЧКОВ`,
          unlocked: true,
        }));
        setAchievements(mapped);
      } catch (err) {
        console.error("Ошибка загрузки достижений:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="achievements-screen">
      <Header title="ГЛАВНАЯ / ДОСТИЖЕНИЯ /" />

      <div className="achievements-content">
        <div className="section-path">/ ГЛАВНАЯ / ДОСТИЖЕНИЯ</div>

        <div className="ufo-wrapper">
          <img src="/images/ufo.png" alt="UFO" />
        </div>

        <div className="exp-bar">
          <div className="exp-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="exp-info">
          <span>ОЧКОВ: {user?.experience || 0}</span>
          <span>УРОВЕНЬ: {currentLevel?.level || 1}</span>
        </div>

        <div className="screen-title-achievements">БАЗА АРТЕФАКТОВ</div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.7 }}>ЗАГРУЗКА...</div>
        ) : achievements.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, opacity: 0.7 }}>
            ДОСТИЖЕНИЙ ПОКА НЕТ — УЧАСТВУЙ В АКТИВНОСТЯХ!
          </div>
        ) : (
          <div className="achievements-list">
            {achievements.map((item) => (
              <AchievementCard key={item.id} achievement={item} />
            ))}
          </div>
        )}

        <button className="btn back fixed" onClick={() => go("main")}>
          <img src="/icons/back.svg" alt="Назад" />
        </button>
      </div>
    </div>
  );
}

export default AchievementsScreen;
