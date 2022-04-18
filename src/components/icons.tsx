import { Component, ComponentProps } from 'solid-js'

type IconComponent = Component<ComponentProps<'svg'>>

export const RefreshIcon: IconComponent = props => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" {...props}>
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

export const ChevronRightIcon: IconComponent = props => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" {...props}>
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

export const HeartIcon: IconComponent = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)
