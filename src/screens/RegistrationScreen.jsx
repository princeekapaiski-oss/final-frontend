import Header from "../components/Header/Header";
import "./RegistrationScreen.css";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation";

function RegistrationScreen({ go, onAuthSuccess }) {
  const { registerUser, loading, telegramUser } = useUser();

  const [form, setForm] = useState({
    firstName: telegramUser?.firstName || "",
    lastName: telegramUser?.lastName || "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setServerError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = (data) => {
    const e = {};
    const fn = validateFirstName(data.firstName);
    if (fn) e.firstName = fn;
    const ln = validateLastName(data.lastName);
    if (ln) e.lastName = ln;
    const em = validateEmail(data.email);
    if (em) e.email = em;
    const pw = validatePassword(data.password);
    if (pw) e.password = pw;
    const cp = validateConfirmPassword(data.password, data.confirmPassword);
    if (cp) e.confirmPassword = cp;
    return e;
  };

  useEffect(() => {
    const validationErrors = validateForm(form);
    const filtered = {};
    for (const key of Object.keys(validationErrors)) {
      if (touched[key]) filtered[key] = validationErrors[key];
    }
    setErrors(filtered);
  }, [form, touched]);

  const allErrors = validateForm(form);
  const isValid = Object.keys(allErrors).length === 0;
  const isFilled =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.password &&
    form.confirmPassword;
  const canSubmit = isValid && isFilled && !loading;

  const handleSubmit = async (e) => {
    e?.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    const newErrors = validateForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      onAuthSuccess();
    } catch (err) {
      setServerError(err.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="registration-screen">
      <Header />

      <div className="registration-content">
        <div className="section-path">НЛО / РЕГИСТРАЦИЯ</div>

        <div className="registration-title">
          ЗАЧИСЛЕНИЕ
          <br />В ЭКИПАЖ
        </div>

        {serverError && (
          <div className="input-error" style={{ textAlign: "center" }}>
            {serverError}
          </div>
        )}

        <div className="registration-form">
          {/* ФАМИЛИЯ */}
          <div
            className={`input-with-icon ${
              errors.lastName && touched.lastName ? "error" : ""
            }`}
          >
            <img src="/icons/profile.svg" alt="" />
            <input
              placeholder="ФАМИЛИЯ"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
            />
          </div>
          {errors.lastName && touched.lastName && (
            <div className="input-error">{errors.lastName}</div>
          )}

          {/* ИМЯ */}
          <div
            className={`input-with-icon ${
              errors.firstName && touched.firstName ? "error" : ""
            }`}
          >
            <img src="/icons/profile.svg" alt="" />
            <input
              placeholder="ИМЯ"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
            />
          </div>
          {errors.firstName && touched.firstName && (
            <div className="input-error">{errors.firstName}</div>
          )}

          {/* EMAIL */}
          <div
            className={`input-with-icon ${
              errors.email && touched.email ? "error" : ""
            }`}
          >
            <img src="/icons/mail.svg" alt="Email" />
            <input
              type="email"
              placeholder="E-MAIL"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
          </div>
          {errors.email && touched.email && (
            <div className="input-error">{errors.email}</div>
          )}

          {/* ПАРОЛЬ */}
          <div
            className={`input-with-icon ${
              errors.password && touched.password ? "error" : ""
            }`}
          >
            <img src="/icons/lock.svg" alt="Password" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="ПАРОЛЬ"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
            />
            <button
              type="button"
              className={`eye-btn ${showPassword ? "active" : ""}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src="/icons/eye.svg" alt="Показать пароль" />
            </button>
          </div>
          {errors.password && touched.password && (
            <div className="input-error">{errors.password}</div>
          )}

          {/* ПОДТВЕРЖДЕНИЕ ПАРОЛЯ */}
          <div
            className={`input-with-icon ${
              errors.confirmPassword && touched.confirmPassword ? "error" : ""
            }`}
          >
            <img src="/icons/lock.svg" alt="Confirm" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="ПОДТВЕРДИТЕ ПАРОЛЬ"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
            />
            <button
              type="button"
              className={`eye-btn ${showConfirm ? "active" : ""}`}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              <img src="/icons/eye.svg" alt="Показать пароль" />
            </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <div className="input-error">{errors.confirmPassword}</div>
          )}
        </div>

        <button
          className="btn-primary"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {loading ? "ЗАГРУЗКА..." : "СОЗДАТЬ АККАУНТ"}
        </button>

        <div className="registration-footer">
          УЖЕ ЕСТЬ АККАУНТ?
          <span onClick={() => go("login")}>ВОЙТИ!</span>
        </div>
      </div>
    </div>
  );
}

export default RegistrationScreen;
