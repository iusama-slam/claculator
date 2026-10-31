// Arithmetic first, so it can be tested without a browser.

export function evaluate(left, operator, right) {
  const a = Number(left)
  const b = Number(right)
  if (operator === '+') return a + b
  if (operator === '-') return a - b
  if (operator === '*') return a * b
  if (operator === '/') return a / b
  throw new Error(`Unknown operator: ${operator}`)
}

export function formatResult(value) {
  if (!Number.isFinite(value)) return String(value)
  const rounded = Math.round(value * 1e10) / 1e10
  return String(rounded)
}

// The key pad. Nothing below runs under Node.

if (typeof document !== 'undefined') {
  const display = document.getElementById('display')
  let current = '0'
  let stored = null
  let operator = null
  let fresh = true

  const show = (text) => { display.textContent = text }

  // Calculation history: in-memory list, newest first, capped at 10,
  // persisted in localStorage so it survives a page reload.
  const SYMBOLS = { '/': '÷', '*': '×', '-': '−', '+': '+' }
  const HISTORY_KEY = 'calc-history'
  const HISTORY_LIMIT = 10
  const historyList = document.getElementById('history-list')
  const historyEmpty = document.getElementById('history-empty')
  const clearHistoryButton = document.getElementById('clear-history')

  let history = []
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    if (Array.isArray(saved)) history = saved.slice(0, HISTORY_LIMIT).map(String)
  } catch {
    history = []
  }

  const saveHistory = () => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)) } catch { /* storage unavailable */ }
  }

  const renderHistory = () => {
    historyList.replaceChildren(
      ...history.map((entry) => {
        const li = document.createElement('li')
        li.textContent = entry
        return li
      })
    )
    historyEmpty.hidden = history.length > 0
    clearHistoryButton.disabled = history.length === 0
  }

  const recordHistory = (left, op, right, result) => {
    history.unshift(`${left} ${SYMBOLS[op] || op} ${right} = ${result}`)
    if (history.length > HISTORY_LIMIT) history.length = HISTORY_LIMIT
    saveHistory()
    renderHistory()
  }

  clearHistoryButton.addEventListener('click', () => {
    history = []
    saveHistory()
    renderHistory()
  })

  renderHistory()

  const press = (digit) => {
    if (fresh || current === '0') current = digit === '.' ? '0.' : digit
    else if (digit !== '.' || !current.includes('.')) current += digit
    fresh = false
    show(current)
  }

  const apply = () => {
    if (stored === null || operator === null) return
    const result = formatResult(evaluate(stored, operator, current))
    recordHistory(stored, operator, current, result)
    current = result
    stored = null
    operator = null
    fresh = true
    show(current)
  }

  document.querySelectorAll('.key').forEach((key) => {
    key.addEventListener('click', () => {
      if (key.dataset.digit !== undefined) return press(key.dataset.digit)
      if (key.dataset.operator) {
        if (stored !== null && !fresh) apply()
        stored = current
        operator = key.dataset.operator
        fresh = true
        return
      }
      if (key.dataset.action === 'equals') return apply()
      if (key.dataset.action === 'clear') {
        current = '0'; stored = null; operator = null; fresh = true
        return show(current)
      }
      if (key.dataset.action === 'sign') {
        current = formatResult(-Number(current))
        return show(current)
      }
      if (key.dataset.action === 'percent') {
        current = formatResult(Number(current) / 100)
        return show(current)
      }
    })
  })
}
