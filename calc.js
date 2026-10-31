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
  // Theme: persisted in localStorage, applied on load, toggled by the button.
  const THEME_KEY = 'calculator-theme'
  const toggle = document.getElementById('theme-toggle')

  const applyTheme = (theme) => {
    const dark = theme === 'dark'
    if (dark) document.documentElement.dataset.theme = 'dark'
    else delete document.documentElement.dataset.theme
    toggle.textContent = dark ? 'Light mode' : 'Dark mode'
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false')
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme')
  }

  let theme = 'light'
  try { theme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light' } catch { /* storage unavailable */ }
  applyTheme(theme)

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(theme)
    try { localStorage.setItem(THEME_KEY, theme) } catch { /* storage unavailable */ }
  })

  const display = document.getElementById('display')
  let current = '0'
  let stored = null
  let operator = null
  let fresh = true

  const show = (text) => { display.textContent = text }

  const press = (digit) => {
    if (fresh || current === '0') current = digit === '.' ? '0.' : digit
    else if (digit !== '.' || !current.includes('.')) current += digit
    fresh = false
    show(current)
  }

  const apply = () => {
    if (stored === null || operator === null) return
    current = formatResult(evaluate(stored, operator, current))
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
