import "./AchievementCard.css";

function AchievementCard({ achievement }) {
  const { title, description, reward, unlocked } = achievement;

  return (
    <div className="achievement-card">
      {/* LEFT ICON */}
      <div className="achievement-icon">
        <img
          src="/icons/achievements.svg"
          alt=""
        />
      </div>

      {/* TEXT */}
      <div className="achievement-info">
        <div className="achievement-title">{title}</div>
        <div className="achievement-description">
          {description}
        </div>
        <div className="achievement-reward">
          [{reward}]
        </div>
      </div>

      {/* STATUS */}
      <div className="achievement-status">
        <img
          src={
            unlocked
              ? "/icons/button/achievement_received.svg"
              : "/icons/button/achievement_not_received.svg"
          }
          alt=""
        />
      </div>
    </div>
  );
}

export default AchievementCard;
