// Регулярки
const nameRegex = /^[A-ZА-ЯЁ]+$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== VALIDATORS =====

export function validateFirstName(value) {
  if (!value) return "Введите имя";
  if (!nameRegex.test(value)) return "Не должно содержать цифры";
  if (value.length < 2) return "Слишком короткое";
  return null;
}

export function validateLastName(value) {
  if (!value) return "Введите фамилию";
  if (!nameRegex.test(value)) return "Не должна содержать цифры";
  if (value.length < 2) return "Слишком короткая";
  return null;
}

export function validateEmail(value) {
  if (!value) return "Введите email";
  if (!emailRegex.test(value)) return "Некорректный email";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Введите пароль";
  if (value.length < 6) return "Минимум 6 символов";
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Подтвердите пароль";
  if (password !== confirmPassword) return "Пароли не совпадают";
  return null;
}
