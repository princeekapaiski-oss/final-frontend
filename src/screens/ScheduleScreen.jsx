import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import ScheduleCard from "../components/ScheduleCard/ScheduleCard";
import "./ScheduleScreen.css";
import { fetchActivities, registerForActivity, cancelActivity } from "../utils/api";

function ScheduleScreen({ go }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (err) {
      setError("Не удалось загрузить расписание");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnroll = async (activityId) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;

    try {
      if (activity.isRegistered) {
        await cancelActivity(activityId);
      } else {
        await registerForActivity(activityId);
      }
      await loadActivities();
    } catch (err) {
      alert(err.data?.error || "Не удалось выполнить действие");
    }
  };

  const mapToLesson = (activity) => {
    const startDate = new Date(activity.startAt);
    const months = [
      "ЯНВАРЯ","ФЕВРАЛЯ","МАРТА","АПРЕЛЯ","МАЯ","ИЮНЯ",
      "ИЮЛЯ","АВГУСТА","СЕНТЯБРЯ","ОКТЯБРЯ","НОЯБРЯ","ДЕКАБРЯ",
    ];

    const date = `${startDate.getDate()} ${months[startDate.getMonth()]}`;
    const time = startDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let userStatus = "available";
    if (activity.isRegistered) userStatus = "enrolled";
    else if (activity.freeSlots !== null && activity.freeSlots <= 0) userStatus = "full";

    return {
      id: activity.id,
      date,
      time,
      title: activity.title,
      description: activity.description || "",
      free_places: activity.freeSlots ?? "∞",
      user_status: userStatus,
    };
  };

  return (
    <div className="schedule-screen">
      <Header title="ГЛАВНАЯ / РАСПИСАНИЕ /" />

      <div className="schedule-content">
        <div className="section-path">/ ГЛАВНАЯ / РАСПИСАНИЕ</div>
        <div className="screen-title">ГРАФИК ИСПЫТАНИЙ</div>

        {loading ? (
          <div className="empty-state">
            <div className="empty-title">ЗАГРУЗКА...</div>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-title">ОШИБКА</div>
            <div className="empty-text">{error}</div>
            <button className="btn primary" onClick={loadActivities} style={{ marginTop: 12 }}>
              ПОВТОРИТЬ
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">ТУТ ПУСТО :(</div>
            <div className="empty-text">
              В БЛИЖАЙШЕЕ ВРЕМЯ ЗДЕСЬ ПОЯВЯТСЯ НОВЫЕ ИСПЫТАНИЯ
            </div>
          </div>
        ) : (
          activities.map((a) => (
            <ScheduleCard
              key={a.id}
              lesson={mapToLesson(a)}
              onToggleEnroll={handleToggleEnroll}
            />
          ))
        )}

        <button className="back-button" onClick={() => go("main")}>
          <img src="/icons/back.svg" alt="Назад" />
        </button>
      </div>
    </div>
  );
}

export default ScheduleScreen;
