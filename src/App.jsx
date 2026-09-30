import { useState } from 'react'
import { add, average, compare, divide, multiply, parseFraction, power, reciprocal, subtract } from './fractionMath.js'
import './App.css'

const initial = { n1: '1', d1: '2', n2: '3', d2: '4', exponent: '2' }
const examples = [
  { label: 'Adding fractions', values: { n1: '1', d1: '2', n2: '1', d2: '3', exponent: '2' } },
  { label: 'Negative values', values: { n1: '-3', d1: '8', n2: '5', d2: '12', exponent: '3' } },
  { label: 'Zero cases', values: { n1: '0', d1: '5', n2: '2', d2: '7', exponent: '-1' } },
]

function format(value) {
  return `${value.n}/${value.d}`
}

function FractionField({ title, numerator, denominator, onChange }) {
  return <section className="fraction-card">
    <div className="fraction-title"><span className="fraction-number">{title === 'Fraction 1' ? 'A' : 'B'}</span><span>{title}</span><span className="fraction-symbol">a⁄b</span></div>
    <div className="fraction-inputs">
      <label><span>NUMERATOR</span><input aria-label={`${title} numerator`} inputMode="numeric" value={numerator} onChange={(event) => onChange('n', event.target.value)} /></label>
      <div className="fraction-line" />
      <label><span>DENOMINATOR</span><input aria-label={`${title} denominator`} inputMode="numeric" value={denominator} onChange={(event) => onChange('d', event.target.value)} /></label>
    </div>
  </section>
}

function App() {
  const [values, setValues] = useState(initial)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }))
    setResults(null)
    setError('')
  }

  function loadExample(example) {
    setValues(example.values)
    setResults(null)
    setError('')
  }

  function calculate() {
    try {
      if (!/^[+-]?\d+$/.test(values.exponent.trim())) throw new Error('Enter an integer exponent.')
      const exponent = Number(values.exponent)
      if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 1000) throw new Error('The exponent must be an integer between -1000 and 1000.')
      const first = parseFraction(values.n1, values.d1, 'Fraction 1')
      const second = parseFraction(values.n2, values.d2, 'Fraction 2')
      const firstInverse = reciprocal(first)
      const secondInverse = reciprocal(second)
      const quotient = divide(first, second)
      const firstPower = power(first, exponent)
      const secondPower = power(second, exponent)
      const order = compare(first, second)

      setResults([
        { label: 'Fraction 1 · simplified', value: format(first), kind: 'fraction' },
        { label: 'Fraction 2 · simplified', value: format(second), kind: 'fraction' },
        { label: 'Sum', value: format(add(first, second)), kind: 'fraction' },
        { label: 'Difference', value: format(subtract(first, second)), kind: 'fraction' },
        { label: 'Product', value: format(multiply(first, second)), kind: 'fraction' },
        { label: 'Quotient', value: quotient ? format(quotient) : 'Undefined · division by zero', kind: quotient ? 'fraction' : 'muted' },
        { label: 'Comparison', value: order < 0 ? 'Fraction 1 is smaller' : order > 0 ? 'Fraction 1 is larger' : 'Fractions are equal', kind: 'text' },
        { label: 'Reciprocal of fraction 1', value: firstInverse ? format(firstInverse) : 'Undefined · zero has no reciprocal', kind: firstInverse ? 'fraction' : 'muted' },
        { label: 'Reciprocal of fraction 2', value: secondInverse ? format(secondInverse) : 'Undefined · zero has no reciprocal', kind: secondInverse ? 'fraction' : 'muted' },
        { label: 'Arithmetic mean', value: format(average(first, second)), kind: 'fraction' },
        { label: `Fraction 1 to the power of ${exponent}`, value: firstPower ? format(firstPower) : 'Undefined · zero cannot be raised to this power', kind: firstPower ? 'fraction' : 'muted' },
        { label: `Fraction 2 to the power of ${exponent}`, value: secondPower ? format(secondPower) : 'Undefined · zero cannot be raised to this power', kind: secondPower ? 'fraction' : 'muted' },
      ])
      setError('')
    } catch (cause) {
      setResults(null)
      setError(cause.message)
    }
  }

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-icon">⅟</span> Ratio<span>Lab</span></a><div className="top-caption"><i /> FRACTION TOOLKIT</div></header>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span /> EXACT ARITHMETIC <b>·</b> 01</div><h1>Fractions,<br /><em>made satisfying.</em></h1><p>Two fractions go in. Clear, simplified answers come out.</p><div className="hero-points"><span><i>✓</i> Always simplified</span><span><i>✓</i> Exact integer math</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-glow"/><div className="floating-chip chip-top">÷</div><div className="fraction-art"><span>3</span><i/><span>5</span></div><b className="art-equals">=</b><div className="art-result"><span>3</span><i/><span>5</span></div><div className="floating-chip chip-bottom">⅟</div><div className="art-caption">SIMPLE BY DESIGN</div></div></section>
    <section className="input-panel">
      <div className="section-heading"><div><span className="step">01</span><h2>Build your fractions</h2></div><span className="helper-label">USE WHOLE NUMBERS</span></div>
      <div className="fraction-row">
        <FractionField title="Fraction 1" numerator={values.n1} denominator={values.d1} onChange={(part, value) => update(part === 'n' ? 'n1' : 'd1', value)} />
        <div className="operator-mark">&amp;</div>
        <FractionField title="Fraction 2" numerator={values.n2} denominator={values.d2} onChange={(part, value) => update(part === 'n' ? 'n2' : 'd2', value)} />
      </div>
      <div className="input-actions"><label className="exponent-label">POWER EXPONENT <input inputMode="numeric" value={values.exponent} onChange={(event) => update('exponent', event.target.value)} /></label><span className="power-hint">Integer from −1000 to 1000</span><button className="calculate-button" onClick={calculate}><span className="button-icon">✦</span> Calculate all <span className="button-arrow">↗</span></button></div>
      <div className="examples"><span>NEED A START?</span>{examples.map((example) => <button key={example.label} onClick={() => loadExample(example)}>{example.label}<span>↗</span></button>)}</div>
      {error && <p className="error-message"><span>!</span>{error}</p>}
    </section>
    <section className="results-section">
      <div className="results-heading"><div><span className="step">02</span><h2>Your results</h2></div>{results && <span className="result-count"><i/> ALL 12 CALCULATIONS</span>}</div>
      {results ? <div className="results-grid">{results.map((item) => <article className="result-card" key={item.label}><span className="result-label">{item.label}</span><strong className={`result-value ${item.kind}`}>{item.value}</strong></article>)}</div> : <div className="empty-state"><span className="empty-symbol">½</span><strong>Your results will appear here</strong><span>Enter two fractions, then calculate.</span></div>}
    </section>
    <footer className="footer"><span>Exact arithmetic, clearly shown.</span><span>React + Vite <b>·</b> BigInt precision</span></footer>
  </main>
}

export default App
