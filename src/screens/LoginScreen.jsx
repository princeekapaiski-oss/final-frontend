import Header from "../components/Header/Header";
import "./LoginScreen.css";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { validateEmail, validatePassword } from "../utils/validation";

function LoginScreen({ go, onAuthSuccess }) {
  const { loginWithEmail, loading, error: authError, setError } = useUser();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const newErrors = {};
    if (touched.email) {
      const e = validateEmail(form.email);
      if (e) newErrors.email = e;
    }
    if (touched.password) {
      const e = validatePassword(form.password);
      if (e) newErrors.password = e;
    }
    setErrors(newErrors);
  }, [form, touched]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setServerError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    const newErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(newErrors).length > 0) return;

    try {
      await loginWithEmail(form.email, form.password);
      onAuthSuccess();
    } catch (err) {
      setServerError(err.message || "Ошибка входа");
    }
  };

  return (
    <div className="login-screen">
      <Header />

      <div className="login-content">
        <div className="section-path">НЛО / ВХОД</div>

        <div className="login-title">
          ИДЕНТИФИКАЦИЯ
          <br />
          ГУМАНОИДА
        </div>

        <div className="login-form">
          {/* SERVER ERROR */}
          {serverError && (
            <div className="input-error" style={{ textAlign: "center" }}>
              {serverError}
            </div>
          )}

          {/* EMAIL */}
          <div className={`input-with-icon ${errors.email ? "error" : ""}`}>
            <img src="/icons/mail.svg" alt="Email" />
            <input
              type="email"
              placeholder="E-MAIL"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
          </div>
          {errors.email && <div className="input-error">{errors.email}</div>}

          {/* PASSWORD */}
          <div className={`input-with-icon ${errors.password ? "error" : ""}`}>
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
          {errors.password && <div className="input-error">{errors.password}</div>}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "ЗАГРУЗКА..." : "ВОЙТИ В АККАУНТ"}
          </button>

          <div className="login-footer">
            ЕЩЁ НЕТ АККАУНТА?
            <span onClick={() => go("registration")}>РЕГИСТРИРУЙСЯ!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
