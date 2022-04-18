import { Component } from 'solid-js'
import { HeartIcon } from './icons'

const Footer: Component = () => {
  return (
    <footer className="flex flex-col items-center space-y-2 py-8 text-center">
      <a
        href="https://mooth.tech/?ref=Wordle%20Score"
        target="_blank"
        rel="noopener noreferrer"
        className="focus-outline group inline-block rounded px-2 hover:underline"
      >
        Made with{' '}
        <HeartIcon class="inline-block h-5 w-5 fill-purple-500 align-middle text-purple-500" /> by{' '}
        <span className="underline group-hover:no-underline">Soorria</span>
      </a>
      <a
        href="https://github.com/mo0th/wordle-score"
        target="_blank"
        rel="noopener noreferrer"
        className="focus-outline group inline-block rounded px-2 hover:underline"
      >
        <span className="underline hover:underline group-hover:no-underline">Source</span> on GitHub
      </a>
    </footer>
  )
}

export default Footer
