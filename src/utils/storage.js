const SETTINGS_KEY = 'pt_settings'
const RECORDS_KEY = 'pt_records'

export const defaultSettings = {
  weight: 70,
  multiplier: 1.6,
  darkMode: true,
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...defaultSettings }
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSettings }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function saveRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function getTodayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getDailyGoal(settings) {
  return Math.round(settings.weight * settings.multiplier * 10) / 10
}

export function getDayProtein(records, dateKey) {
  const dayRecords = records[dateKey] || []
  return dayRecords.reduce((sum, r) => sum + r.protein, 0)
}

export function getCompletionPercent(consumed, goal) {
  if (!goal) return 0
  return Math.round((consumed / goal) * 100)
}

export function getStatusColor(percent) {
  if (percent >= 90) return '#22c55e'
  if (percent >= 50) return '#eab308'
  return '#ef4444'
}
