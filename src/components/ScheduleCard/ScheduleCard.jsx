import { useState } from "react";
import "./ScheduleCard.css";

function ScheduleCard({ lesson, onToggleEnroll }) {
  const [expanded, setExpanded] = useState(false);

  const {
    id,
    date,
    time,
    title,
    description,
    free_places,
    user_status,
  } = lesson;

  const renderActionButton = () => {
    if (user_status === "full") {
      return <button className="btn disabled">МЕСТ НЕТ</button>;
    }

    if (user_status === "enrolled") {
      return (
        <button
          className="btn success"
          onClick={() => onToggleEnroll(id)}
        >
          НЕ ПОЙДУ
        </button>
      );
    }

    return (
      <button
        className="btn primary"
        onClick={() => onToggleEnroll(id)}
      >
        ПОЙДУ!
      </button>
    );
  };

  return (
    <div className={`schedule-card ${expanded ? "expanded" : ""}`}>
      {/* HEADER */}
      <div className="card-header">
        <div className="card-date">
          {date} {time}
        </div>
        <div className="card-places">
          МЕСТ: {free_places}
        </div>
      </div>

      <div className="card-divider" />

      {/* TITLE */}
      <div className="card-title">{title}</div>

      {/* DESCRIPTION */}
      {expanded && description && (
        <div className="card-description">{description}</div>
      )}

      {/* FOOTER */}
      <div className="card-footer">
        {!expanded && description ? (
          <button
            className="btn outline"
            onClick={() => setExpanded(true)}
          >
            ЕЩЁ
          </button>
        ) : description ? (
          <button
            className="btn arrow-btn"
            onClick={() => setExpanded(false)}
          >
            <img src="/icons/arrow.svg" alt="Свернуть" />
          </button>
        ) : (
          <div />
        )}

        {renderActionButton()}
      </div>
    </div>
  );
}

export default ScheduleCard;
