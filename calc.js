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

  const backspace = () => {
    current = current.length > 1 ? current.slice(0, -1) : '0'
    fresh = false
    show(current)
  }

  // One entry point for both clicks and keyboard input.
  const activate = ({ digit, operator: op, action }) => {
    if (digit !== undefined) return press(digit)
    if (op) {
      if (stored !== null && !fresh) apply()
      stored = current
      operator = op
      fresh = true
      return
    }
    if (action === 'equals') return apply()
    if (action === 'clear') {
      current = '0'; stored = null; operator = null; fresh = true
      return show(current)
    }
    if (action === 'sign') {
      current = formatResult(-Number(current))
      return show(current)
    }
    if (action === 'percent') {
      current = formatResult(Number(current) / 100)
      return show(current)
    }
    if (action === 'backspace') return backspace()
  }

  document.querySelectorAll('.key').forEach((key) => {
    key.addEventListener('click', () => activate(key.dataset))
  })

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    const key = event.key
    if (/^[0-9]$/.test(key)) {
      event.preventDefault()
      return activate({ digit: key })
    }
    if (key === '.') {
      event.preventDefault()
      return activate({ digit: '.' })
    }
    if (key === '+' || key === '-' || key === '*' || key === '/') {
      event.preventDefault()
      return activate({ operator: key })
    }
    if (key === 'Enter' || key === '=') {
      event.preventDefault()
      return activate({ action: 'equals' })
    }
    if (key === 'Backspace') {
      event.preventDefault()
      return activate({ action: 'backspace' })
    }
    if (key === 'Escape') {
      event.preventDefault()
      return activate({ action: 'clear' })
    }
    // Every other key is ignored and left to the browser.
  })
}
