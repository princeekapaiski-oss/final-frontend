import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ProfileScreen.css";
import { useUser } from "../context/UserContext";
import { updateMe } from "../utils/api";
import { LEVELS, getCurrentLevel } from "../utils/levels";

function ProfileScreen({ go }) {
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { user, refreshUser } = useUser();
  const currentLevel = getCurrentLevel(LEVELS, user?.experience || 0);

  // Начальное состояние из данных пользователя
  const initProfile = () => ({
    firstName:  user?.firstName  || "",
    lastName:   user?.lastName   || "",
    email:      user?.email      || "",
    password:   "",
    direction:  user?.direction  || "",
    course:     user?.course     || "",
    birthDate:  user?.birthDate  || "",
  });

  const [savedProfile,  setSavedProfile]  = useState(initProfile);
  const [draftProfile,  setDraftProfile]  = useState(initProfile);
  const [errors,        setErrors]        = useState({});

  // Подтягиваем данные если user подгрузился позже
  useEffect(() => {
    if (user) {
      const p = initProfile();
      setSavedProfile(p);
      setDraftProfile(p);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Валидация
  useEffect(() => {
    const e = {};
    if (!draftProfile.firstName || draftProfile.firstName.length < 2)
      e.firstName = "Имя слишком короткое";
    if (!draftProfile.lastName || draftProfile.lastName.length < 2)
      e.lastName = "Фамилия слишком короткая";
    if (!draftProfile.email.includes("@"))
      e.email = "Некорректный email";
    if (draftProfile.password && draftProfile.password.length < 6)
      e.password = "Минимум 6 символов";
    setErrors(e);
  }, [draftProfile]);

  const isChanged = JSON.stringify(draftProfile) !== JSON.stringify(savedProfile);
  const isValid   = Object.keys(errors).length === 0;
  const canSave   = isChanged && isValid && !saving;

  const set = (field) => (e) =>
    setDraftProfile((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      await updateMe({
        firstName: draftProfile.firstName,
        lastName:  draftProfile.lastName,
        email:     draftProfile.email,
        ...(draftProfile.password ? { password: draftProfile.password } : {}),
        direction: draftProfile.direction,
        course:    draftProfile.course,
        birthDate: draftProfile.birthDate,
      });
      await refreshUser();
      setSavedProfile({ ...draftProfile, password: "" });
      setDraftProfile((prev) => ({ ...prev, password: "" }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-screen">
      <Header title="ГЛАВНАЯ / ПРОФИЛЬ /" />

      <div className="profile-content">
        <div className="section-path">/ ГЛАВНАЯ / ПРОФИЛЬ</div>

        <div className="screen-title-profile">КАРТОЧКА ИНЖЕНЕРА</div>

        {/* КАРТОЧКА */}
        <div className="profile-main-card">
          <div className="avatar-placeholder" />

          <div className="profile-main-info">
            <div className="profile-name">
              <div>{savedProfile.firstName}</div>
              <div>{savedProfile.lastName}</div>
            </div>

            <div className="profile-id">ID: {user?.id || "—"}</div>

            <div className="profile-bottom">
              <div className="profile-role">
                {savedProfile.direction || "НАПРАВЛЕНИЕ НЕ УКАЗАНО"}
              </div>
              <div className="profile-level">
                УРОВЕНЬ: {currentLevel?.level || 1}
              </div>
            </div>
          </div>
        </div>

        {/* ФОРМА */}
        <div className="profile-form">

          {/* ИМЯ */}
          <label>
            ИМЯ
            <input
              value={draftProfile.firstName}
              onChange={set("firstName")}
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </label>

          {/* ФАМИЛИЯ */}
          <label>
            ФАМИЛИЯ
            <input
              value={draftProfile.lastName}
              onChange={set("lastName")}
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </label>

          {/* EMAIL */}
          <label>
            E-MAIL
            <input
              type="email"
              value={draftProfile.email}
              onChange={set("email")}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          {/* ПАРОЛЬ */}
          <label>
            ПАРОЛЬ
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Оставьте пустым чтобы не менять"
                value={draftProfile.password}
                onChange={set("password")}
              />
              <button
                type="button"
                className={`eye-btn ${showPassword ? "active" : ""}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src="/icons/eye.svg" alt="Показать пароль" />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          {/* НАПРАВЛЕНИЕ ОБУЧЕНИЯ */}
          <label>
            НАПРАВЛЕНИЕ ОБУЧЕНИЯ
            <input
              placeholder="например: ИДД, ПИ, РПИ..."
              value={draftProfile.direction}
              onChange={set("direction")}
            />
          </label>

          {/* КУРС */}
          <label>
            КУРС
            <input
              placeholder="1, 2, 3..."
              value={draftProfile.course}
              onChange={set("course")}
            />
          </label>

          {/* ДАТА РОЖДЕНИЯ */}
          <label>
            ДАТА РОЖДЕНИЯ
            <input
              type="date"
              value={draftProfile.birthDate || ""}
              onChange={set("birthDate")}
            />
          </label>

        </div>

        {/* СООБЩЕНИЯ */}
        {saveError   && <div className="save-error">{saveError}</div>}
        {saveSuccess && <div className="save-success">✅ СОХРАНЕНО!</div>}

        {/* КНОПКИ */}
        <div className="profile-actions">
          <button
            className="btn save"
            onClick={handleSave}
            disabled={!canSave}
          >
            {saving ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
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
