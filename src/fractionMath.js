function gcd(a, b) {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b !== 0n) [a, b] = [b, a % b]
  return a
}

export function fraction(numerator, denominator) {
  if (denominator === 0n) throw new Error('The denominator cannot be zero.')
  const divisor = gcd(numerator, denominator)
  if (divisor !== 0n) {
    numerator /= divisor
    denominator /= divisor
  }
  if (denominator < 0n) {
    numerator = -numerator
    denominator = -denominator
  }
  return { n: numerator, d: denominator }
}

export function parseFraction(numerator, denominator, name) {
  if (!/^[+-]?\d+$/.test(numerator.trim())) throw new Error(`${name}: enter an integer numerator.`)
  if (!/^[+-]?\d+$/.test(denominator.trim())) throw new Error(`${name}: enter an integer denominator.`)
  const n = BigInt(numerator)
  const d = BigInt(denominator)
  if (d === 0n) throw new Error(`${name}: the denominator cannot be zero.`)
  return fraction(n, d)
}

export function add(a, b) {
  return fraction(a.n * b.d + b.n * a.d, a.d * b.d)
}

export function subtract(a, b) {
  return fraction(a.n * b.d - b.n * a.d, a.d * b.d)
}

export function multiply(a, b) {
  return fraction(a.n * b.n, a.d * b.d)
}

export function divide(a, b) {
  if (b.n === 0n) return null
  return fraction(a.n * b.d, a.d * b.n)
}

export function compare(a, b) {
  const left = a.n * b.d
  const right = b.n * a.d
  return left < right ? -1 : left > right ? 1 : 0
}

export function reciprocal(value) {
  if (value.n === 0n) return null
  return fraction(value.d, value.n)
}

export function power(value, exponent) {
  if (value.n === 0n && exponent <= 0) return null
  let base = exponent < 0 ? reciprocal(value) : value
  let remaining = Math.abs(exponent)
  let result = fraction(1n, 1n)
  while (remaining > 0) {
    if (remaining % 2 === 1) result = multiply(result, base)
    remaining = Math.floor(remaining / 2)
    if (remaining > 0) base = multiply(base, base)
  }
  return result
}

export function average(a, b) {
  return fraction(a.n * b.d + b.n * a.d, 2n * a.d * b.d)
}
