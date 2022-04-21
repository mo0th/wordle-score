import { Link } from 'solid-app-router'
import { Component, JSXElement } from 'solid-js'

const NotHomePageLayout: Component<{ title: JSXElement }> = props => {
  return (
    <div class="space-y-8 text-center">
      <h2 class="mb-8 text-4xl">{props.title}</h2>
      {props.children}
      <div>
        <Link class="link px-2" href="/">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotHomePageLayout
