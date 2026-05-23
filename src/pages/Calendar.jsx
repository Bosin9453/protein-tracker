import { useState } from 'react'
import {
  formatDateKey,
  getTodayKey,
  getDailyGoal,
  getDayProtein,
  getCompletionPercent,
} from '../utils/storage.js'

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

function getDayClass(percent, hasData) {
  if (!hasData) return 'no-data'
  if (percent >= 90) return 'green'
  if (percent >= 50) return 'yellow'
  return 'red'
}

export default function Calendar({ settings, records }) {
  const todayKey = getTodayKey()
  const todayDate = new Date()

  const [viewYear, setViewYear] = useState(todayDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth()) // 0-indexed

  const goal = getDailyGoal(settings)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(y => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(y => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月']

  // Build grid cells
  const cells = []
  // Empty leading cells
  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">月曆</div>
        <div className="page-subtitle">每日蛋白質攝取概況</div>
      </div>

      <div className="page-body">
      <div className="calendar-nav">
        <button className="calendar-nav-btn" onClick={prevMonth} aria-label="上個月">‹</button>
        <span className="calendar-month-title">{viewYear}年 {monthNames[viewMonth]}</span>
        <button className="calendar-nav-btn" onClick={nextMonth} aria-label="下個月">›</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {WEEKDAY_LABELS.map(d => (
            <div key={d} className="calendar-weekday">{d}</div>
          ))}
        </div>

        <div className="calendar-days">
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="calendar-day empty" />
            }

            const dateKey = formatDateKey(viewYear, viewMonth + 1, day)
            const protein = getDayProtein(records, dateKey)
            const hasData = (records[dateKey] || []).length > 0
            const percent = hasData ? getCompletionPercent(protein, goal) : 0
            const dayClass = getDayClass(percent, hasData)
            const isToday = dateKey === todayKey

            return (
              <div
                key={dateKey}
                className={`calendar-day ${dayClass}${isToday ? ' today' : ''}`}
              >
                <span className="calendar-day-num">{day}</span>
                {hasData && (
                  <span className="calendar-day-protein">
                    {protein.toFixed(0)}g
                  </span>
                )}
                {isToday && <span className="today-dot" />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#22c55e' }} />
          <span>≥90%</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#eab308' }} />
          <span>50–89%</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#ef4444' }} />
          <span>&lt;50%</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }} />
          <span>無紀錄</span>
        </div>
      </div>

      {/* Monthly summary */}
      <MonthSummary
        viewYear={viewYear}
        viewMonth={viewMonth}
        daysInMonth={daysInMonth}
        records={records}
        goal={goal}
      />
      </div>
    </>
  )
}

function MonthSummary({ viewYear, viewMonth, daysInMonth, records, goal }) {
  let totalDays = 0
  let greenDays = 0
  let yellowDays = 0
  let redDays = 0
  let totalProtein = 0

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(viewYear, viewMonth + 1, d)
    const dayRecs = records[dateKey] || []
    if (dayRecs.length > 0) {
      totalDays++
      const protein = dayRecs.reduce((s, r) => s + r.protein, 0)
      totalProtein += protein
      const pct = getCompletionPercent(protein, goal)
      if (pct >= 90) greenDays++
      else if (pct >= 50) yellowDays++
      else redDays++
    }
  }

  if (totalDays === 0) return null

  return (
    <div className="card">
      <div className="records-title" style={{ marginBottom: 12 }}>本月統計</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <SummaryItem label="記錄天數" value={`${totalDays}天`} />
        <SummaryItem label="平均攝取" value={`${(totalProtein / totalDays).toFixed(1)}g`} />
        <SummaryItem label="達標天數 (≥90%)" value={`${greenDays}天`} color="#22c55e" />
        <SummaryItem label="普通天數 (50-89%)" value={`${yellowDays}天`} color="#eab308" />
      </div>
    </div>
  )
}

function SummaryItem({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--input-bg)',
      borderRadius: 8,
      padding: '10px 12px',
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: color || 'var(--text)' }}>{value}</div>
    </div>
  )
}
