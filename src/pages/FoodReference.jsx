import { useState } from 'react'
import foods from '../data/foods.js'

export default function FoodReference() {
  const [search, setSearch] = useState('')

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="page-header">
        <div className="page-title">食物參考</div>
        <div className="page-subtitle">每種食物每100g的蛋白質含量</div>
      </div>

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
            <FoodRefCard key={food.name} food={food} />
          ))
        )}
      </div>
    </>
  )
}

function FoodRefCard({ food }) {
  const isFixed = food.fixedProtein !== undefined

  return (
    <div className="food-ref-item">
      <div className="food-ref-header">
        <span className="food-ref-name">{food.name}</span>
        <span className="food-ref-protein-badge">
          {isFixed
            ? `固定 ${food.fixedProtein}g`
            : `${food.proteinPer100g}g / 100g`}
        </span>
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
  // Extract a reference portion from portionNote for quick calc
  // Show a quick reference for common portion sizes
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
    '雞胸肉': [{ label: '100g', grams: 100 }, { label: '200g (一塊)', grams: 200 }],
    '雞蛋': [{ label: '一顆 (55g)', grams: 55 }, { label: '兩顆 (110g)', grams: 110 }],
    '水煮蛋': [{ label: '一顆 (55g)', grams: 55 }, { label: '兩顆 (110g)', grams: 110 }],
    '板豆腐': [{ label: '100g', grams: 100 }, { label: '一塊 (300g)', grams: 300 }],
    '嫩豆腐': [{ label: '100g', grams: 100 }, { label: '一盒 (350g)', grams: 350 }],
    '毛豆': [{ label: '一碗 (100g)', grams: 100 }, { label: '200g', grams: 200 }],
    '鮭魚': [{ label: '100g', grams: 100 }, { label: '一片 (150g)', grams: 150 }],
    '鮪魚罐頭': [{ label: '100g', grams: 100 }, { label: '一罐 (170g)', grams: 170 }],
    '豬里肌': [{ label: '100g', grams: 100 }, { label: '150g', grams: 150 }],
    '牛肉片': [{ label: '100g', grams: 100 }, { label: '一份 (150g)', grams: 150 }],
    '蝦子': [{ label: '100g', grams: 100 }, { label: '200g', grams: 200 }],
    '牛奶': [{ label: '一杯 (240g)', grams: 240 }, { label: '100g', grams: 100 }],
    '希臘優格': [{ label: '一杯 (150g)', grams: 150 }, { label: '100g', grams: 100 }],
    '雞腿肉': [{ label: '100g', grams: 100 }, { label: '一隻 (200g)', grams: 200 }],
    '鯛魚': [{ label: '100g', grams: 100 }, { label: '一片 (120g)', grams: 120 }],
    '豬腱': [{ label: '100g', grams: 100 }, { label: '一份 (150g)', grams: 150 }],
    '納豆': [{ label: '一盒 (50g)', grams: 50 }, { label: '100g', grams: 100 }],
    '花生醬': [{ label: '一匙 (15g)', grams: 15 }, { label: '30g', grams: 30 }],
  }
  return portionMap[food.name] || null
}
