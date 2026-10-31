# Simple Calculator

A small calculator that runs in the browser. Plain HTML, CSS and JavaScript,
no build step: open `index.html` and it works.

## What is here

- `index.html` lays out the display and the key pad.
- `styles.css` is the look: a light theme, one accent colour for the equals key.
- `calc.js` holds the arithmetic (`evaluate`, `formatResult`) and wires the keys to the display.
- `test/calc.test.js` checks the arithmetic with Node's test runner.

## Run

```
open index.html
npm test
```

## Known gaps

- There is no dark theme and no way to switch themes.
- Keyboard input is not supported; only the on-screen keys work.
- Dividing by zero shows "Infinity" instead of a friendly message.
- There is no history of past calculations.
