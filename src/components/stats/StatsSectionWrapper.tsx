import { Component, JSXElement } from 'solid-js'

interface StatsSectionWrapperProps {
  title: JSXElement
}

const StatsSectionWrapper: Component<StatsSectionWrapperProps> = props => {
  return (
    <div class="space-y-6">
      <h3 class="font-poppins text-xl font-bold">{props.title}</h3>

      {props.children}
    </div>
  )
}

export default StatsSectionWrapper
