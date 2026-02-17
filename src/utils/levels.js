// Список уровней (можно расширять сколько угодно)
export const LEVELS = [
  { level: 1, requiredExp: 0 },
  { level: 2, requiredExp: 100 },
  { level: 3, requiredExp: 500 },
  { level: 4, requiredExp: 1200 },
  { level: 5, requiredExp: 2500 },
  { level: 6, requiredExp: 5000 },
];

// Текущий уровень по опыту
export function getCurrentLevel(levels, experience) {
  return levels
    .filter(l => experience >= l.requiredExp)
    .at(-1);
}

// Следующий уровень
export function getNextLevel(levels, currentLevel) {
  return levels.find(l => l.level === currentLevel.level + 1);
}

// Процент прогресса до следующего уровня
export function getProgressPercent(levels, experience) {
  const currentLevel = getCurrentLevel(levels, experience);
  const nextLevel = getNextLevel(levels, currentLevel);

  if (!nextLevel) return 100;

  return (
    (experience - currentLevel.requiredExp) /
    (nextLevel.requiredExp - currentLevel.requiredExp)
  ) * 100;
}
