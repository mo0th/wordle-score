import { JSXElement, mapArray } from 'solid-js'

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

export const cx = (...arr: any[]): string =>
  arr.filter(el => Boolean(el) && typeof el === 'string').join(' ')

export const debounce = <T extends CallableFunction>(
  fn: T,
  delay: number
): T => {
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

export const toFixedOrLess = (n: number, dp: number) => {
  const str = n.toFixed(dp).replace(/(\.)?0+$/g, '')
  return str
}
