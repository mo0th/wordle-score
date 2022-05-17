import { dequal } from 'dequal'
import { Component, createMemo, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useScoreContext } from '~/lib/score-context'
import { ScoreRecord } from '~/types'
import Button from '../Button'
import Collapse from '../Collapse'
import { Comparison } from './BackupRestore'

type ModifiedScoreRecord = Record<keyof ScoreRecord, ScoreRecord[keyof ScoreRecord] | 'N/A'>
type ForceSyncStatus = 'idle' | 'comparing' | 'success' | 'failed'
const IDS = { comparison: 'comparison' }

const ForceSync: Component = () => {
  const [{ allScores, syncDetails, record }, { forceSync }] = useScoreContext()

  const [state, setState] = createStore({
    status: 'idle' as ForceSyncStatus,
  })

  const remoteData = createMemo(
    () => (allScores() || {})[syncDetails().user]?.record || {},
    undefined,
    {
      equals: dequal,
    }
  )

  const differences = createMemo(() => {
    const current = record()
    const remote = remoteData()
    if (!remote) return { record: {}, remote: {} }

    const days = new Set(
      Object.keys(current)
        .concat(Object.keys(remote))
        .map(n => parseInt(n))
    )

    const result: Record<'record' | 'remote', ModifiedScoreRecord> = {
      record: {},
      remote: {},
    }

    for (const i of days) {
      const fromRecord = current[i]
      const fromBackup = remote[i]

      if (fromBackup === fromRecord) {
        continue
      }

      result.record[i] = 'N/A'
      result.remote[i] = 'N/A'

      if (fromBackup && fromRecord) {
        result.record[i] = fromRecord
        result.remote[i] = fromRecord
      } else if (fromBackup) {
        result.remote[i] = fromBackup
      } else if (fromRecord) {
        result.record[i] = fromRecord
      }
    }

    return result
  })

  const Reset: Component = () => (
    <Button
      block
      onClick={() => {
        setState({
          status: 'idle',
        })
      }}
    >
      Reset
    </Button>
  )

  return (
    <div class="space-y-4">
      <p>Force Sync</p>
      <div class="space-y-4 text-sm">
        <Show when={state.status === 'idle'}>
          <Button block onClick={() => setState('status', 'comparing')}>
            Force Sync Your Score
          </Button>
        </Show>

        <Show when={state.status === 'failed'}>
          <p>Failed to force sync.</p>
          <Reset />
        </Show>

        <Show when={state.status === 'success'}>
          <p>Force sync done!</p>
          <Reset />
        </Show>

        <Show when={state.status === 'comparing'}>
          <div id={IDS.comparison} class="space-y-2 text-sm">
            <p>Compare and Confirm</p>

            <Collapse summary="Differences" defaultOpen>
              <Comparison
                leftTitle={'Server Data'}
                left={differences()!.remote}
                rightTitle={'Current Data'}
                right={differences()!.record}
                fallback="No differences"
              />
            </Collapse>

            <Collapse summary="All Data">
              <Comparison
                leftTitle={'Server Data'}
                left={remoteData()}
                rightTitle={'Current Data'}
                right={record()}
              />
            </Collapse>

            <Button
              block
              onClick={async () => {
                await forceSync()
                setState('status', 'success')
              }}
            >
              Confirm
            </Button>
            <Reset />
          </div>
        </Show>
      </div>
    </div>
  )
}

export default ForceSync
