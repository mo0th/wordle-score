import { JSXElement, mapArray } from 'solid-js'
import { ScoreRecord } from '~/types'

export const minmax = <T>(arr: T[]): [min: T, max: T] => {
  if (arr.length < 1) {
    throw new Error('Array must have at least 1 item')
  }

  let min = arr[0]
  let max = arr[0]

  for (const it of arr) {
    if (it < min) {
      min = it
    } else if (it > max) {
      max = it
    }
  }

  return [min, max]
}

export const getValidIntKeysAsNumbers = <T extends Record<string, unknown>>(
  record: T
): number[] => {
  return Object.keys(record)
    .map(str => parseInt(str))
    .filter(n => Number.isInteger(n))
}

export const getHistoryDiffs = (a: ScoreRecord, b: ScoreRecord): number => {
  const [minA, maxA] = minmax(getValidIntKeysAsNumbers(a))
  const [minB, maxB] = minmax(getValidIntKeysAsNumbers(b))
  const min = Math.min(minA, minB)
  const max = Math.min(maxA, maxB)

  let diffs = 0
  for (let i = min; i <= max; ++i) {
    if (a[i] !== b[i]) diffs++
  }

  return diffs
}

export const cx = (...arr: any[]): string =>
  arr.filter(el => Boolean(el) && typeof el === 'string').join(' ')

export const debounce = <T extends CallableFunction>(fn: T, delay: number): T => {
  let timer: ReturnType<typeof setTimeout>

  return ((...args: any[]) => {
    if (timer) clearTimeout(timer)
    setTimeout(() => {
      fn(...args)
    }, delay)
  }) as any
}

export const plural = (n: number, singular: string, pluralised: string) =>
  n === 1 ? singular : pluralised

export const jsxJoin = (arr: JSXElement[], sep: () => JSXElement) => {
  if (arr.length === 0) return []
  const result: JSXElement[] = [arr[0]]

  for (let i = 1; i < arr.length; i++) {
    result.push(sep, arr[i])
  }

  return mapArray(
    () => result,
    e => e
  )
}

export const toFixedOrLess = (n: number, dp: number): string => {
  return (Math.round(n * Math.pow(10, dp)) / Math.pow(10, dp)).toString()
}

type FormatOptions = Partial<{ len: number; shortenBigNumbers: boolean; truncateMax: number }>
export const formatScoreNumber = (n: number, opts?: FormatOptions): string => {
  const { len = 2, shortenBigNumbers = true, truncateMax = 1e9 } = opts || {}
  if (shortenBigNumbers && nDigits(n) > 15) return n.toExponential(len)
  if (n < truncateMax) {
    return toFixedOrLess(n, 0)
  }
  const f = toFixedOrLess(n, len)
  return f
}

export const inspect = <T>(t: T, msg?: string): T => {
  if (msg) console.log(msg, t)
  else console.log(t)
  return t
}

export const toggle = (t: boolean) => !t

export const nDigits = (n: number): number => {
  const str = Math.round(n).toString()
  if (!str.includes('e')) {
    return str.length
  }
  const eIndex = str.indexOf('e')
  const exponent = Math.abs(parseInt(str.substring(eIndex + 1)))
  return exponent
}

export const lessThanOrEqualWithError = (a: number, b: number, err: number) =>
  a <= b || Math.abs(a - b) <= Math.abs(err)

export const random = (n: number) => Math.floor(Math.random() * n)

export const randomItem = <T>(arr: T[]): T => arr[random(arr.length)]

export const scrollToHash = (hash: string, top = true) => {
  document.getElementById(hash)?.scrollIntoView(top)
}

export const cond = <T>(c: boolean, a: T, b: T): T => (c ? a : b)

export const sum = (arr: number[]): number => arr.reduce((a, c) => a + c, 0)

export const isDynamicImportError = (err: unknown): err is TypeError =>
  err instanceof TypeError &&
  Boolean(
    err.message.match(/failed to (fetch dynamically imported module|resolve module specifier)/i)
  )
