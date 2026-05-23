import { useState } from 'react'
import builtinFoods from '../data/foods.js'
import { getCustomFoods, saveCustomFoods, generateId } from '../utils/storage.js'

export default function FoodReference() {
  const [search, setSearch] = useState('')
  const [customFoods, setCustomFoods] = useState(() => getCustomFoods())
  const [showForm, setShowForm] = useState(false)

  const allFoods = [...builtinFoods, ...customFoods]

  const filtered = allFoods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd(newFood) {
    const updated = [...customFoods, { ...newFood, id: generateId(), custom: true }]
    setCustomFoods(updated)
    saveCustomFoods(updated)
    setShowForm(false)
  }

  function handleDelete(id) {
    const updated = customFoods.filter(f => f.id !== id)
    setCustomFoods(updated)
    saveCustomFoods(updated)
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">食物參考</div>
        <div className="page-subtitle">每種食物每100g的蛋白質含量</div>
      </div>

      <div className="page-body">
      <div style={{ padding: '12px 16px 12px' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? '取消' : '+ 新增自訂食物'}
        </button>
      </div>

      {showForm && (
        <AddFoodForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <div className="food-search-bar">
        <input
          className="form-input"
          type="text"
          placeholder="搜尋食物..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="food-ref-list">
        {filtered.length === 0 ? (
          <div className="empty-state">找不到符合的食物</div>
        ) : (
          filtered.map(food => (
            <FoodRefCard
              key={food.id ?? food.name}
              food={food}
              onDelete={food.custom ? () => handleDelete(food.id) : null}
            />
          ))
        )}
      </div>
      </div>
    </>
  )
}

function AddFoodForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [isFixed, setIsFixed] = useState(false)
  const [proteinPer100g, setProteinPer100g] = useState('')
  const [fixedProtein, setFixedProtein] = useState('')
  const [portionNote, setPortionNote] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('請輸入食物名稱'); return }
    if (isFixed) {
      if (!fixedProtein || isNaN(fixedProtein) || Number(fixedProtein) <= 0) {
        setError('請輸入有效的蛋白質克數'); return
      }
      onAdd({ name: name.trim(), proteinPer100g: 0, fixedProtein: Number(fixedProtein), portionNote: portionNote.trim() || '一份' })
    } else {
      if (!proteinPer100g || isNaN(proteinPer100g) || Number(proteinPer100g) < 0) {
        setError('請輸入有效的蛋白質含量'); return
      }
      onAdd({ name: name.trim(), proteinPer100g: Number(proteinPer100g), portionNote: portionNote.trim() || '依重量計算' })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      margin: '0 16px 12px',
      padding: 16,
      borderRadius: 12,
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontWeight: 600, fontSize: 15 }}>新增自訂食物</div>

      <div>
        <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>食物名稱</label>
        <input
          className="form-input"
          type="text"
          placeholder="例：自製雞肉沙拉"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setIsFixed(false)}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: !isFixed ? 'var(--primary)' : 'var(--input-bg)',
            color: !isFixed ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border)', cursor: 'pointer',
          }}
        >
          每100g計算
        </button>
        <button
          type="button"
          onClick={() => setIsFixed(true)}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: isFixed ? 'var(--primary)' : 'var(--input-bg)',
            color: isFixed ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border)', cursor: 'pointer',
          }}
        >
          固定蛋白質
        </button>
      </div>

      {!isFixed ? (
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>每100g 蛋白質 (g)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="例：20.5"
            value={proteinPer100g}
            onChange={e => { setProteinPer100g(e.target.value); setError('') }}
          />
        </div>
      ) : (
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>固定蛋白質克數 (g／份)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            step="0.1"
            placeholder="例：30"
            value={fixedProtein}
            onChange={e => { setFixedProtein(e.target.value); setError('') }}
          />
        </div>
      )}

      <div>
        <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>份量備註（選填）</label>
        <input
          className="form-input"
          type="text"
          placeholder="例：一份約150g"
          value={portionNote}
          onChange={e => setPortionNote(e.target.value)}
        />
      </div>

      {error && <div style={{ fontSize: 13, color: '#ef4444' }}>{error}</div>}

      <button type="submit" className="btn btn-primary">儲存食物</button>
    </form>
  )
}

function FoodRefCard({ food, onDelete }) {
  const isFixed = food.fixedProtein !== undefined

  return (
    <div className="food-ref-item">
      <div className="food-ref-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="food-ref-name">{food.name}</span>
          {food.custom && (
            <span style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 10,
              background: 'rgba(99,102,241,0.15)', color: '#818cf8',
              border: '1px solid rgba(99,102,241,0.3)', fontWeight: 500,
            }}>自訂</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="food-ref-protein-badge">
            {isFixed ? `固定 ${food.fixedProtein}g` : `${food.proteinPer100g}g / 100g`}
          </span>
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)', fontSize: 16, padding: '0 2px',
                lineHeight: 1,
              }}
              title="刪除"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="food-ref-note">份量參考：{food.portionNote}</div>
      {isFixed && (
        <div className="food-ref-fixed">★ 特殊品項：一份固定含 {food.fixedProtein}g 蛋白質，不需輸入重量</div>
      )}
      {!isFixed && (
        <PortionHelper food={food} />
      )}
    </div>
  )
}

function PortionHelper({ food }) {
  const portions = getCommonPortions(food)
  if (!portions) return null

  return (
    <div style={{
      marginTop: 8,
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
    }}>
      {portions.map(p => (
        <span key={p.label} style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '3px 8px',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}>
          {p.label}: <strong style={{ color: 'var(--text)' }}>
            {(p.grams * food.proteinPer100g / 100).toFixed(1)}g 蛋白質
          </strong>
        </span>
      ))}
    </div>
  )
}

function getCommonPortions(food) {
  const portionMap = {
    // 禽肉
    '雞胸肉': [{ label: '100g', grams: 100 }, { label: '200g (一塊)', grams: 200 }],
    '雞腿肉': [{ label: '100g', grams: 100 }, { label: '一隻 (200g)', grams: 200 }],
    '火雞胸肉': [{ label: '100g', grams: 100 }, { label: '一片 (150g)', grams: 150 }],
    // 豬肉
    '豬里肌': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    '豬腱': [{ label: '100g', grams: 100 }, { label: '一份 (150g)', grams: 150 }],
    '豬五花': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    // 牛肉
    '牛肉片': [{ label: '100g', grams: 100 }, { label: '一份 (150g)', grams: 150 }],
    '牛絞肉 (瘦)': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    // 海鮮
    '鮭魚': [{ label: '100g', grams: 100 }, { label: '一片 (150g)', grams: 150 }],
    '鮪魚罐頭': [{ label: '100g', grams: 100 }, { label: '一罐 (170g)', grams: 170 }],
    '鱈魚': [{ label: '100g', grams: 100 }, { label: '一片 (150g)', grams: 150 }],
    '鯛魚': [{ label: '100g', grams: 100 }, { label: '一片 (120g)', grams: 120 }],
    '沙丁魚罐頭': [{ label: '100g', grams: 100 }, { label: '一罐 (100g)', grams: 100 }],
    '蝦子': [{ label: '100g', grams: 100 }, { label: '200g', grams: 200 }],
    '花枝/魷魚': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    '蛤蜊': [{ label: '100g (肉)', grams: 100 }, { label: '200g (肉)', grams: 200 }],
    '牡蠣': [{ label: '6顆 (90g)', grams: 90 }, { label: '100g', grams: 100 }],
    '章魚': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    // 蛋
    '雞蛋': [{ label: '一顆 (55g)', grams: 55 }, { label: '兩顆 (110g)', grams: 110 }],
    '水煮蛋': [{ label: '一顆 (55g)', grams: 55 }, { label: '兩顆 (110g)', grams: 110 }],
    // 豆類
    '板豆腐': [{ label: '100g', grams: 100 }, { label: '一塊 (300g)', grams: 300 }],
    '嫩豆腐': [{ label: '100g', grams: 100 }, { label: '一盒 (350g)', grams: 350 }],
    '毛豆': [{ label: '一碗 (100g)', grams: 100 }, { label: '200g', grams: 200 }],
    '納豆': [{ label: '一盒 (50g)', grams: 50 }, { label: '100g', grams: 100 }],
    '天貝': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    '扁豆 (熟)': [{ label: '半杯 (100g)', grams: 100 }, { label: '200g', grams: 200 }],
    '黑豆 (熟)': [{ label: '半杯 (100g)', grams: 100 }, { label: '200g', grams: 200 }],
    '豆漿': [{ label: '一杯 (240g)', grams: 240 }, { label: '100g', grams: 100 }],
    // 乳製品
    '牛奶': [{ label: '一杯 (240g)', grams: 240 }, { label: '100g', grams: 100 }],
    '希臘優格': [{ label: '一杯 (150g)', grams: 150 }, { label: '100g', grams: 100 }],
    '茅屋起司': [{ label: '100g', grams: 100 }, { label: '200g', grams: 200 }],
    '切達起司': [{ label: '一片 (30g)', grams: 30 }, { label: '100g', grams: 100 }],
    // 堅果與種子
    '杏仁': [{ label: '一把 (30g)', grams: 30 }, { label: '100g', grams: 100 }],
    '花生醬': [{ label: '一匙 (15g)', grams: 15 }, { label: '30g', grams: 30 }],
    '南瓜籽': [{ label: '一把 (30g)', grams: 30 }, { label: '100g', grams: 100 }],
    '奇亞籽': [{ label: '一匙 (15g)', grams: 15 }, { label: '30g', grams: 30 }],
    // 穀類
    '藜麥 (熟)': [{ label: '一碗 (200g)', grams: 200 }, { label: '100g', grams: 100 }],
  }
  return portionMap[food.name] || null
}
