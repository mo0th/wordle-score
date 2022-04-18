import SParticles from 'solid-particles'
import { Component } from 'solid-js'
import { cx } from '~/utils/misc'
import { loadConfettiPreset } from 'tsparticles-preset-confetti'

const Particles: Component<{ id?: string; class?: string }> = props => {
  return (
    <SParticles
      id={props.id}
      init={async engine => loadConfettiPreset(engine)}
      className={cx('fixed z-50', props.class)}
      options={{
        preset: 'confetti',
        particles: {
          color: {
            value: ['#f43f5e', '#ef4444', '#10b981', '#0ea5e9', '#6366f1', '#d946ef'],
          },
        },
        spread: 75,
        emitters: [
          {
            autoPlay: true,
            fill: true,
            life: {
              wait: false,
            },
            rate: {
              quantity: 5,
              delay: 0.3,
            },
            shape: 'square',
            startCount: 50,
            size: {
              mode: 'percent',
              height: 0,
              width: 0,
            },
            position: {
              x: 50,
              y: -10,
            },
            particles: {
              move: { direction: 'bottom' },
            },
          },
          {
            autoPlay: true,
            fill: true,
            life: {
              wait: false,
            },
            rate: {
              quantity: 5,
              delay: 0.3,
            },
            shape: 'square',
            startCount: 50,
            size: {
              mode: 'percent',
              height: 0,
              width: 0,
            },
            position: {
              x: 10,
              y: -10,
            },
            particles: {
              move: { direction: 'bottom-right' },
            },
          },
          {
            autoPlay: true,
            fill: true,
            life: {
              wait: false,
            },
            rate: {
              quantity: 5,
              delay: 0.3,
            },
            shape: 'square',
            startCount: 50,
            size: {
              mode: 'percent',
              height: 0,
              width: 0,
            },
            position: {
              x: 90,
              y: -10,
            },
            particles: {
              move: { direction: 'bottom-left' },
            },
          },
        ],
      }}
    />
  )
}

export default Particles
