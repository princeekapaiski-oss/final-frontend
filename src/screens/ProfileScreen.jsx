import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ProfileScreen.css";
import { useUser } from "../context/UserContext";
import { updateMe } from "../utils/api";
import { LEVELS, getCurrentLevel } from "../utils/levels";

function ProfileScreen({ go }) {
  const { user, refreshUser } = useUser();
  const currentLevel = getCurrentLevel(LEVELS, user?.experience || 0);

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const initialProfile = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
  };

  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [draftProfile, setDraftProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      const p = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
      };
      setSavedProfile(p);
      setDraftProfile(p);
    }
  }, [user]);

  const validateProfile = (p) => {
    const e = {};
    if (!p.firstName || p.firstName.length < 2) e.firstName = "Имя слишком короткое";
    if (!p.lastName || p.lastName.length < 2) e.lastName = "Фамилия слишком короткая";
    if (!p.email || !p.email.includes("@")) e.email = "Некорректный email";
    if (p.password && p.password.length < 6) e.password = "Минимум 6 символов";
    return e;
  };

  useEffect(() => {
    setErrors(validateProfile(draftProfile));
  }, [draftProfile]);

  const isChanged = JSON.stringify(draftProfile) !== JSON.stringify(savedProfile);
  const isValid = Object.keys(errors).length === 0;
  const canSave = isChanged && isValid && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaveMsg("");

    try {
      const body = {};
      if (draftProfile.firstName !== savedProfile.firstName) body.firstName = draftProfile.firstName;
      if (draftProfile.lastName !== savedProfile.lastName) body.lastName = draftProfile.lastName;
      if (draftProfile.email !== savedProfile.email) body.email = draftProfile.email;
      if (draftProfile.password) body.password = draftProfile.password;

      await updateMe(body);
      await refreshUser();

      setSavedProfile({ ...draftProfile, password: "" });
      setDraftProfile((prev) => ({ ...prev, password: "" }));
      setSaveMsg("СОХРАНЕНО ✓");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (err) {
      setSaveMsg(err.message || "ОШИБКА СОХРАНЕНИЯ");
    } finally {
      setSaving(false);
    }
  };

  const profileId = user?.id ? String(user.id).padStart(6, "0") : "------";

  return (
    <div className="profile-screen">
      <Header title="ГЛАВНАЯ / ПРОФИЛЬ /" />

      <div className="profile-content">
        <div className="section-path">/ ГЛАВНАЯ / ПРОФИЛЬ</div>

        <div className="screen-title-profile">КАРТОЧКА ИНЖЕНЕРА</div>

        {/* MAIN CARD */}
        <div className="profile-main-card">
          <div className="avatar-placeholder" />

          <div className="profile-main-info">
            <div className="profile-name">
              <div>{(user?.firstName || "").toUpperCase()}</div>
              <div>{(user?.lastName || "").toUpperCase()}</div>
            </div>

            <div className="profile-id">ID: {profileId}</div>

            <div className="profile-bottom">
              {user?.username && (
                <div className="profile-role">@{user.username}</div>
              )}
              <div className="profile-level">УРОВЕНЬ: {currentLevel?.level || 1}</div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="profile-form">
          <label>
            ПОСЕЩЕНО / ПРОПУЩЕНО
            <input
              value={`${user?.stats?.visited || 0} / ${user?.stats?.missed || 0}`}
              readOnly
            />
          </label>

          <label>
            ИМЯ
            <input
              value={draftProfile.firstName}
              onChange={(e) =>
                setDraftProfile({ ...draftProfile, firstName: e.target.value })
              }
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </label>

          <label>
            ФАМИЛИЯ
            <input
              value={draftProfile.lastName}
              onChange={(e) =>
                setDraftProfile({ ...draftProfile, lastName: e.target.value })
              }
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </label>

          <label>
            E-MAIL
            <input
              value={draftProfile.email}
              onChange={(e) =>
                setDraftProfile({ ...draftProfile, email: e.target.value })
              }
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            НОВЫЙ ПАРОЛЬ
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Оставьте пустым если не менять"
                value={draftProfile.password}
                onChange={(e) =>
                  setDraftProfile({ ...draftProfile, password: e.target.value })
                }
              />
              <button
                type="button"
                className={`eye-btn ${showPassword ? "active" : ""}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src="/icons/eye.svg" alt="Показать" />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>
        </div>

        {/* SAVE MESSAGE */}
        {saveMsg && (
          <div
            style={{
              textAlign: "center",
              padding: "8px",
              color: saveMsg.includes("✓") ? "#65e52a" : "#ff6bc4",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
            }}
          >
            {saveMsg}
          </div>
        )}

        {/* ACTIONS */}
        <div className="profile-actions">
          <button className="btn save" onClick={handleSave} disabled={!canSave}>
            {saving ? "СОХРАНЯЮ..." : "СОХРАНИТЬ"}
          </button>

          <button className="btn back" onClick={() => go("main")}>
            <img src="/icons/back.svg" alt="Назад" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
