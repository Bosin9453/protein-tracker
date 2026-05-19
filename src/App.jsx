import { useState, useEffect } from 'react'
import Today from './pages/Today.jsx'
import Calendar from './pages/Calendar.jsx'
import FoodReference from './pages/FoodReference.jsx'
import Settings from './pages/Settings.jsx'
import { getSettings, saveSettings, getRecords, saveRecords } from './utils/storage.js'

const TABS = [
  { key: 'today', label: '今日', icon: '🏠' },
  { key: 'calendar', label: '月曆', icon: '📅' },
  { key: 'food', label: '食物參考', icon: '🍗' },
  { key: 'settings', label: '設定', icon: '⚙️' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [settings, setSettings] = useState(() => getSettings())
  const [records, setRecords] = useState(() => getRecords())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light')
  }, [settings.darkMode])

  function handleUpdateSettings(newSettings) {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    saveSettings(merged)
  }

  function handleUpdateRecords(newRecords) {
    setRecords(newRecords)
    saveRecords(newRecords)
  }

  return (
    <div className="app-container">
      <div className="page-content">
        {activeTab === 'today' && (
          <Today
            settings={settings}
            records={records}
            onUpdateRecords={handleUpdateRecords}
          />
        )}
        {activeTab === 'calendar' && (
          <Calendar
            settings={settings}
            records={records}
          />
        )}
        {activeTab === 'food' && (
          <FoodReference />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </div>

      <nav className="bottom-nav">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`nav-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            aria-label={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
