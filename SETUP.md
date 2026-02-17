# Telegram MiniApp — Настройка и подключение

## Архитектура

```
┌──────────────────┐        ┌──────────────────┐        ┌──────────────┐
│  Telegram App    │        │  Frontend (React) │        │ Backend (Flask)│
│                  │        │  Vercel / Netlify │        │ Render / VPS   │
│  WebApp.initData ├──────►│                   ├──────►│                │
│                  │        │  /auth/telegram    │  JWT  │  SQLite/PG    │
└──────────────────┘        └──────────────────┘        └──────────────┘
```

**Поток авторизации:**
1. Пользователь открывает MiniApp в Telegram
2. Telegram передаёт `initData` (подписанные данные пользователя)
3. Frontend отправляет `initData` → Backend `/auth/telegram`
4. Backend проверяет подпись через `TELEGRAM_BOT_TOKEN`
5. Backend создаёт/находит пользователя → возвращает JWT
6. Frontend сохраняет JWT и использует для всех запросов

---

## 1. Настройка Backend

### Локально
```bash
cd miniapp-backend
cp .env.example .env
# Отредактируйте .env — укажите TELEGRAM_BOT_TOKEN

pip install -r requirements.txt

# Инициализация БД
flask db upgrade

# Запуск
python run.py
```

### На Render.com
1. Создайте Web Service → подключите репозиторий
2. **Build Command:** `pip install -r requirements.txt && flask db upgrade`
3. **Start Command:** `gunicorn wsgi:app`
4. **Environment Variables:**
   - `SECRET_KEY` — любая случайная строка
   - `JWT_SECRET_KEY` — любая случайная строка
   - `TELEGRAM_BOT_TOKEN` — токен от @BotFather
   - `ADMIN_API_KEY` — ключ для админских API
   - `FRONTEND_URL` — URL вашего фронтенда (для CORS)
   - `DATABASE_URL` — если используете PostgreSQL

### API Endpoints
| Метод | URL | Auth | Описание |
|-------|-----|------|----------|
| POST | `/auth/telegram` | - | Авторизация через Telegram initData |
| POST | `/auth/dev` | - | DEV: авторизация без Telegram |
| GET | `/me` | JWT | Профиль пользователя |
| GET | `/activities` | JWT | Список активностей |
| POST | `/activities/:id/register` | JWT | Записаться |
| POST | `/activities/:id/cancel` | JWT | Отменить запись |
| GET | `/achievements/my` | JWT | Мои достижения |
| GET | `/health` | - | Health check |

---

## 2. Настройка Frontend

### Локально
```bash
cd miniapp-frontend
cp .env.example .env
# Отредактируйте .env — укажите URL бэкенда

npm install
npm start
```

### Переменные окружения
```env
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

### Деплой на Vercel
1. Подключите репозиторий на Vercel
2. **Build Command:** `npm run build`
3. **Output Directory:** `build`
4. **Environment Variables:**
   - `REACT_APP_BACKEND_URL` = URL вашего бэкенда

### Деплой на Netlify
1. **Build Command:** `npm run build`
2. **Publish Directory:** `build`
3. Добавьте `REACT_APP_BACKEND_URL` в Environment Variables

---

## 3. Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите `TELEGRAM_BOT_TOKEN`
3. Настройте MiniApp:
   - `/newapp` в BotFather
   - Укажите URL фронтенда как Web App URL
4. Добавьте токен в `.env` бэкенда

---

## 4. Что было исправлено

### Frontend
- **`src/utils/api.js`** — централизованный модуль API (единая точка для URL бэкенда, токена, запросов)
- **`src/context/UserContext.js`** — авторизация через Telegram initData, загрузка профиля из API
- **`src/App.js`** — автоматическая авторизация при запуске, экран загрузки
- **`src/screens/MainScreen.jsx`** — приветствие по имени из API
- **`src/screens/ScheduleScreen.jsx`** — загрузка расписания из `/activities`, запись/отмена через API
- **`src/screens/AchievementsScreen.jsx`** — загрузка достижений из `/achievements/my`
- **`src/screens/ProfileScreen.jsx`** — данные из контекста (API), без hardcoded URL
- Удалены `LoginScreen` и `RegistrationScreen` (в Telegram MiniApp авторизация автоматическая)
- Исправлено: ключ токена в localStorage теперь везде `"accessToken"`

### Backend
- Добавлен `.env.example` с описанием всех переменных
- CORS настроен через `FRONTEND_URL`

---

## 5. Локальная разработка без Telegram

Если `window.Telegram.WebApp.initData` отсутствует (открыли в обычном браузере), фронтенд автоматически использует `/auth/dev` — это создаёт тестового пользователя с `telegram_id = 999999999`.

> ⚠️ В продакшене рекомендуется закрыть `/auth/dev` endpoint.
