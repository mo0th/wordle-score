type PlausibleFunction = (eventName: string, props: Record<string, unknown>) => void

const _plausible = (window as any).plausible as PlausibleFunction | undefined

export const plausible: PlausibleFunction = (eventName, props) => _plausible?.(eventName, { props })
