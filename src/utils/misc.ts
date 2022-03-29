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
