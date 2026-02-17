import "./AchievementCard.css";

function AchievementCard({ achievement }) {
  const { title, description, reward, imageUrl, unlocked } = achievement;

  return (
    <div className={`achievement-card ${unlocked ? "unlocked" : "locked"}`}>

      {/* ИКОНКА */}
      <div className="achievement-icon">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <img src="/icons/achievements.svg" alt="" />
        )}
      </div>

      {/* ТЕКСТ */}
      <div className="achievement-info">
        <div className="achievement-title">{title}</div>
        <div className="achievement-description">{description}</div>
        <div className="achievement-reward">[{reward}]</div>
      </div>

      {/* СТАТУС */}
      <div className="achievement-status">
        {unlocked ? (
          <img src="/icons/button/achievement_received.svg" alt="получено" />
        ) : (
          <div className="lock-icon">🔒</div>
        )}
      </div>

    </div>
  );
}

export default AchievementCard;
