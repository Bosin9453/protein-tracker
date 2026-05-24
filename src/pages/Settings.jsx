import { getDailyGoal } from '../utils/storage.js'

export default function Settings({ settings, onUpdateSettings }) {
  const goal = getDailyGoal(settings)

  function handleWeightChange(e) {
    const val = parseFloat(e.target.value)
    if (!isNaN(val) && val > 0) {
      onUpdateSettings({ weight: val })
    }
  }

  function handleMultiplierChange(e) {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      onUpdateSettings({ multiplier: val })
    }
  }

  function handleDarkModeToggle(e) {
    onUpdateSettings({ darkMode: e.target.checked })
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">設定</div>
        <div className="page-subtitle">個人化您的蛋白質目標</div>
      </div>

      <div className="page-body">
      {/* Daily Goal Display */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="goal-display">
          <div>
            <div className="goal-display-label">每日蛋白質目標</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {settings.weight}kg × {settings.multiplier} g/kg
            </div>
          </div>
          <div className="goal-display-value">{goal}g</div>
        </div>
      </div>

      {/* Body Settings */}
      <div className="settings-section" style={{ marginTop: 16 }}>
        <div className="settings-section-title">身體數據</div>

        <div className="settings-row">
          <div>
            <div className="settings-label">體重</div>
            <div className="settings-sublabel">用於計算每日目標</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              className="settings-input"
              type="number"
              value={settings.weight}
              onChange={handleWeightChange}
              min="30"
              max="300"
              step="0.5"
            />
            <span style={{ color: 'var(--text-secondary)', fontSize: 14, minWidth: 20 }}>kg</span>
          </div>
        </div>
      </div>

      {/* Protein Multiplier */}
      <div className="settings-section">
        <div className="settings-section-title">蛋白質係數</div>

        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div className="settings-label">每公斤體重蛋白質</div>
              <div className="settings-sublabel">建議範圍 1.2 – 2.5 g/kg</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#22c55e' }}>
                {settings.multiplier.toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>g/kg</span>
            </div>
          </div>

          <div className="slider-container" style={{ width: '100%' }}>
            <input
              type="range"
              className="range-input"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.multiplier}
              onChange={handleMultiplierChange}
            />
            <div className="range-labels">
              <span>1.2 (一般)</span>
              <span>1.6 (健身)</span>
              <span>2.5 (高強度)</span>
            </div>
          </div>
        </div>

        {/* Multiplier guide */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <MultiplierGuide range="1.2 – 1.4" label="一般活動量" active={settings.multiplier >= 1.2 && settings.multiplier <= 1.4} />
          <MultiplierGuide range="1.4 – 1.8" label="規律健身" active={settings.multiplier > 1.4 && settings.multiplier <= 1.8} />
          <MultiplierGuide range="1.8 – 2.2" label="高強度訓練" active={settings.multiplier > 1.8 && settings.multiplier <= 2.2} />
          <MultiplierGuide range="2.2 – 2.5" label="競技運動員" active={settings.multiplier > 2.2} />
        </div>
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <div className="settings-section-title">外觀</div>

        <div className="settings-row">
          <div>
            <div className="settings-label">深色模式</div>
            <div className="settings-sublabel">{settings.darkMode ? '深色主題已啟用' : '淺色主題已啟用'}</div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={handleDarkModeToggle}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="settings-section">
        <div className="settings-section-title">關於</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <p style={{ fontWeight: 600, color: 'var(--text)' }}>蛋白質追蹤器 v1.0.3</p>
          <div style={{
            marginTop: 6,
            marginBottom: 10,
            padding: '8px 10px',
            borderRadius: 8,
            background: 'var(--input-bg)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>v1.0.3 更新備註</p>
            <p>同步食物資料庫至每日攝取頁面</p>
          </div>
          <div style={{
            marginBottom: 10,
            padding: '8px 10px',
            borderRadius: 8,
            background: 'var(--input-bg)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>v1.0.2 更新備註</p>
            <p>頁面變得美美噠~</p>
          </div>
          <div style={{
            marginBottom: 10,
            padding: '8px 10px',
            borderRadius: 8,
            background: 'var(--input-bg)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>v1.0.1 更新備註</p>
            <p>新增USDA食物來源</p>
          </div>
          <p>所有資料儲存於本機裝置，不上傳任何伺服器。</p>
          <p style={{ marginTop: 8 }}>資料格式：pt_settings、pt_records（localStorage）</p>
        </div>

        <button
          className="btn btn-secondary"
          style={{ marginTop: 16, width: '100%' }}
          onClick={() => {
            if (window.confirm('確定要清除所有紀錄嗎？此操作無法復原。')) {
              localStorage.removeItem('pt_records')
              window.location.reload()
            }
          }}
        >
          清除所有紀錄
        </button>
      </div>
      </div>
    </>
  )
}

function MultiplierGuide({ range, label, active }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 10px',
      borderRadius: 8,
      background: active ? 'rgba(34, 197, 94, 0.1)' : 'var(--input-bg)',
      border: active ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border)',
      transition: 'all 0.2s ease',
    }}>
      <span style={{
        fontSize: 13,
        color: active ? '#22c55e' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 400,
      }}>{label}</span>
      <span style={{
        fontSize: 12,
        color: active ? '#22c55e' : 'var(--text-secondary)',
        fontFamily: 'monospace',
      }}>{range}</span>
    </div>
  )
}
