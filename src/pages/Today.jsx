import { useState, useEffect, useRef } from 'react'
import foods from '../data/foods.js'
import {
  getTodayKey,
  generateId,
  getDailyGoal,
  getCompletionPercent,
  getStatusColor,
} from '../utils/storage.js'

const RADIUS = 80
const STROKE = 12
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const SIZE = (RADIUS + STROKE) * 2 + 4

function CircularProgress({ consumed, goal }) {
  const [animated, setAnimated] = useState(0)
  const percent = getCompletionPercent(consumed, goal)
  const clampedPercent = Math.min(percent, 100)
  const color = getStatusColor(percent)
  const offset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE
  const center = SIZE / 2

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(clampedPercent)
    }, 50)
    return () => clearTimeout(timer)
  }, [clampedPercent])

  return (
    <div className="progress-container">
      <svg
        className="progress-svg"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={RADIUS}
          fill="none"
          stroke="var(--circle-bg)"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
        {/* Center text: grams */}
        <text
          x={center}
          y={center - 10}
          className="progress-center-text progress-grams"
          style={{ fill: 'var(--text)' }}
        >
          {consumed.toFixed(1)}g / {goal.toFixed(1)}g
        </text>
        {/* Center text: percent */}
        <text
          x={center}
          y={center + 14}
          className="progress-center-text progress-percent"
          style={{ fill: color }}
        >
          {percent}%
        </text>
      </svg>
      {percent > 100 && (
        <div className="progress-overcap">超標 🎉</div>
      )}
    </div>
  )
}

export default function Today({ settings, records, onUpdateRecords }) {
  const [showModal, setShowModal] = useState(false)
  const todayKey = getTodayKey()
  const todayRecords = records[todayKey] || []
  const goal = getDailyGoal(settings)
  const consumed = todayRecords.reduce((s, r) => s + r.protein, 0)

  function handleAddRecord(record) {
    const updated = {
      ...records,
      [todayKey]: [...todayRecords, record],
    }
    onUpdateRecords(updated)
    setShowModal(false)
  }

  function handleDelete(id) {
    const updated = {
      ...records,
      [todayKey]: todayRecords.filter(r => r.id !== id),
    }
    onUpdateRecords(updated)
  }

  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[today.getDay()]

  return (
    <>
      <div className="page-header">
        <div className="page-title">今日攝取</div>
        <div className="page-subtitle">{dateStr} 週{weekday}</div>
      </div>

      <CircularProgress consumed={consumed} goal={goal} />

      <div className="add-record-btn">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + 新增紀錄
        </button>
      </div>

      <div className="records-section">
        <div className="records-title">今日紀錄</div>
        {todayRecords.length === 0 ? (
          <div className="empty-state">還沒有紀錄，點擊上方按鈕開始記錄吧！</div>
        ) : (
          <div className="record-list">
            {todayRecords.map(record => (
              <div key={record.id} className="record-item">
                <div className="record-info">
                  <div className="record-name">{record.food}</div>
                  <div className="record-detail">
                    {record.grams > 0 ? `${record.grams}g` : '固定份量'}
                  </div>
                </div>
                <span className="record-protein">+{record.protein.toFixed(1)}g</span>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(record.id)}
                  aria-label="刪除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddRecordModal
          onAdd={handleAddRecord}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function AddRecordModal({ onAdd, onClose }) {
  const [mode, setMode] = useState('db') // 'db' | 'custom'
  const [searchText, setSearchText] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('')
  const [customName, setCustomName] = useState('')
  const [customProtein, setCustomProtein] = useState('')
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  const isFixed = selectedFood && selectedFood.fixedProtein !== undefined
  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(searchText.toLowerCase()) && searchText.length > 0
  )

  const computedProtein = isFixed
    ? selectedFood.fixedProtein
    : selectedFood
      ? Math.round((parseFloat(grams) || 0) * selectedFood.proteinPer100g) / 100
      : 0

  function handleSelectFood(food) {
    setSelectedFood(food)
    setSearchText(food.name)
    setShowDropdown(false)
    setGrams('')
    if (food.fixedProtein !== undefined) {
      setGrams('0')
    }
  }

  function handleSearchChange(e) {
    setSearchText(e.target.value)
    setSelectedFood(null)
    setShowDropdown(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'db') {
      if (!selectedFood) return
      if (!isFixed && (!grams || parseFloat(grams) <= 0)) return
      const record = {
        id: generateId(),
        food: selectedFood.name,
        grams: isFixed ? 0 : parseFloat(grams),
        protein: isFixed ? selectedFood.fixedProtein : computedProtein,
      }
      onAdd(record)
    } else {
      if (!customName.trim()) return
      if (!customProtein || parseFloat(customProtein) <= 0) return
      const record = {
        id: generateId(),
        food: customName.trim(),
        grams: 0,
        protein: parseFloat(customProtein),
      }
      onAdd(record)
    }
  }

  const canSubmit = mode === 'db'
    ? (selectedFood && (isFixed || (grams && parseFloat(grams) > 0)))
    : (customName.trim() && customProtein && parseFloat(customProtein) > 0)

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-sheet">
        <div className="modal-header">
          <div className="modal-title">新增蛋白質紀錄</div>
          <button className="modal-close" onClick={onClose} aria-label="關閉">✕</button>
        </div>

        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn${mode === 'db' ? ' active' : ''}`}
            onClick={() => { setMode('db'); setSelectedFood(null); setSearchText(''); setGrams(''); }}
          >
            從食物庫選擇
          </button>
          <button
            type="button"
            className={`mode-btn${mode === 'custom' ? ' active' : ''}`}
            onClick={() => { setMode('custom'); setCustomName(''); setCustomProtein(''); }}
          >
            自行輸入
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'db' ? (
            <>
              <div className="form-group">
                <label className="form-label">搜尋食物</label>
                <div className="food-search-wrapper" ref={searchRef}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="輸入食物名稱..."
                    value={searchText}
                    onChange={handleSearchChange}
                    onFocus={() => searchText && setShowDropdown(true)}
                    autoComplete="off"
                  />
                  {showDropdown && filteredFoods.length > 0 && (
                    <div className="food-dropdown" ref={dropdownRef}>
                      {filteredFoods.map(food => (
                        <div
                          key={food.name}
                          className="food-option"
                          onMouseDown={() => handleSelectFood(food)}
                          onTouchStart={() => handleSelectFood(food)}
                        >
                          <div className="food-option-name">{food.name}</div>
                          <div className="food-option-protein">
                            {food.fixedProtein !== undefined
                              ? `固定 ${food.fixedProtein}g 蛋白質`
                              : `每100g 含 ${food.proteinPer100g}g 蛋白質`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showDropdown && searchText && filteredFoods.length === 0 && (
                    <div className="food-dropdown">
                      <div className="food-option">
                        <div className="food-option-protein" style={{ textAlign: 'center' }}>找不到符合的食物</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isFixed ? '份量（固定）' : '重量（公克）'}
                </label>
                <input
                  className="form-input"
                  type="number"
                  placeholder={isFixed ? '固定份量，無需輸入' : '輸入公克數...'}
                  value={isFixed ? '' : grams}
                  onChange={e => setGrams(e.target.value)}
                  disabled={isFixed}
                  min="0"
                  step="any"
                />
              </div>

              <div className="protein-preview">
                <span className="protein-preview-label">蛋白質</span>
                <span className="protein-preview-value">{computedProtein.toFixed(1)} g</span>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">食物名稱</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="輸入食物名稱..."
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label className="form-label">蛋白質（公克）</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="輸入蛋白質克數..."
                  value={customProtein}
                  onChange={e => setCustomProtein(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="protein-preview">
                <span className="protein-preview-label">蛋白質</span>
                <span className="protein-preview-value">
                  {customProtein ? parseFloat(customProtein).toFixed(1) : '0.0'} g
                </span>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.5 }}
          >
            新增
          </button>
        </form>
      </div>
    </div>
  )
}
