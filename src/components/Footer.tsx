import { Component } from 'solid-js'
import { HeartIcon } from './icons'

const Footer: Component = () => {
  return (
    <footer className="py-8 text-center flex flex-col items-center space-y-2">
      <a
        href="https://mooth.tech/?ref=Wordle%20Score"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-block px-2 hover:underline focus-outline rounded"
      >
        Made with{' '}
        <HeartIcon class="w-5 h-5 inline-block align-middle fill-purple-500 text-purple-500" />{' '}
        by <span className="underline group-hover:no-underline">Soorria</span>
      </a>
      <a
        href="https://github.com/mo0th/wordle-score"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-block px-2 hover:underline focus-outline rounded"
      >
        <span className="underline group-hover:no-underline hover:underline">
          Source
        </span>{' '}
        on GitHub
      </a>
    </footer>
  )
}

export default Footer
