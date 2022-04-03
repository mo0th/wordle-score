import SParticles from 'solid-particles'
import { Component } from 'solid-js'
import { cx } from '../../utils/misc'
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
            value: [
              '#f43f5e',
              '#ef4444',
              '#10b981',
              '#0ea5e9',
              '#6366f1',
              '#d946ef',
            ],
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
              quantity: 10,
              delay: 0.1,
            },
            shape: 'square',
            startCount: 0,
            size: {
              mode: 'percent',
              height: 0,
              width: 0,
            },
            position: {
              x: 50,
              y: 0,
            },
          },
        ],
      }}
    />
  )
}

export default Particles
