import { Component, createEffect, createMemo, For, JSXElement, Show, mergeProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import { getClassesForScore } from '~/lib/colors'
import { useScoreContext } from '~/lib/score-context'
import { ScoreRecord } from '~/types'
import { cx, scrollToHash } from '~/utils/misc'
import { useCopy } from '~/utils/use-copy'
import Button from '~/components/Button'
import Collapse from '~/components/Collapse'

type ModifiedScoreRecord = Record<keyof ScoreRecord, ScoreRecord[keyof ScoreRecord] | 'N/A'>

export const Comparison: Component<{
  left: ModifiedScoreRecord
  leftTitle: JSXElement
  right: ModifiedScoreRecord
  rightTitle: JSXElement
  fallback?: string
}> = _props => {
  const props = mergeProps({ fallback: 'No data' }, _props)
  const data = (record: ModifiedScoreRecord) => {
    return (
      <For each={Object.entries(record)} fallback={<p class="text-center">{props.fallback}</p>}>
        {([day, score]) => (
          <p>
            Day {day} - <span class={cx('font-mono', getClassesForScore(score))}>{score}</span>
          </p>
        )}
      </For>
    )
  }

  const side = (title: JSXElement, record: ModifiedScoreRecord) => (
    <div class="space-y-2 rounded border-2 border-gray-400 p-2 text-sm">
      <p class="text-center capitalize">{title}</p>
      <div class="space-y-1">{data(record)}</div>
    </div>
  )

  return (
    <div class="grid grid-cols-2 gap-2">
      {side(props.leftTitle, props.left)}
      {side(props.rightTitle, props.right)}
    </div>
  )
}

const IDS = { comparison: 'comparison' }

type RestoreStatus = 'idle' | 'comparing' | 'success' | 'failed'
const BackupRestore: Component = () => {
  const [
    { canRestore, allScores, syncDetails, record },
    { getJsonBackup, importJsonBackup, isBackupValid },
  ] = useScoreContext()

  const [copy, copied] = useCopy()

  const [state, setState] = createStore({
    status: 'idle' as RestoreStatus,
    backup: null as ScoreRecord | null,
    message: '',
    source: '',
  })
  let fileInputRef: HTMLInputElement | undefined = undefined

  createEffect(() => {
    if (state.status === 'comparing') scrollToHash(IDS.comparison)
  })

  const toClipboard = async () => {
    const backup = getJsonBackup()
    await copy(backup)
  }

  const toFile = async () => {
    const backup = getJsonBackup()
    const blob = new Blob([backup])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'wordle-score-backup.json'
    a.rel = 'noopener'
    a.dispatchEvent(new MouseEvent('click'))
  }

  const parseAndSet = (text: string, source: string) => {
    const parsed = JSON.parse(text)
    if (!isBackupValid(parsed)) throw new Error('invalid backup')
    setState({
      backup: parsed,
      source,
      status: 'comparing',
    })
  }

  const fromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      parseAndSet(text, 'clipboard')
    } catch {
      setState({
        status: 'failed',
        message: 'Invalid backup in clipboard',
        backup: null,
        source: 'clipboard',
      })
    }
  }

  const fromFile = async (file: File) => {
    try {
      const text = await file.text()
      parseAndSet(text, 'file')
    } catch {
      setState({
        status: 'failed',
        message: 'Invalid backup file',
        backup: null,
        source: 'file',
      })
    }
  }

  const fromServerData = async () => {
    const all = allScores()
    if (!all) return
    const serverDataForUser = all[syncDetails().user]?.record
    if (!serverDataForUser || !isBackupValid(serverDataForUser)) {
      setState({
        status: 'failed',
        message: 'No server data saved',
        backup: null,
        source: 'server',
      })
      return
    }

    setState({
      status: 'comparing',
      backup: serverDataForUser,
      source: 'server',
    })
  }

  const confirm = () => {
    importJsonBackup(state.backup)
    setState({
      status: 'success',
      backup: null,
      source: '',
      message: '',
    })
  }

  const differences = createMemo(() => {
    const current = record()
    const backup = state.backup
    if (!backup) return

    const days = new Set(
      Object.keys(current)
        .concat(Object.keys(backup))
        .map(n => parseInt(n))
    )

    const result: Record<'record' | 'backup', ModifiedScoreRecord> = {
      record: {},
      backup: {},
    }

    for (const i of days) {
      const fromRecord = current[i]
      const fromBackup = backup[i]

      if (fromBackup === fromRecord) {
        continue
      }

      result.record[i] = 'N/A'
      result.backup[i] = 'N/A'

      if (fromBackup && fromRecord) {
        result.record[i] = fromRecord
        result.backup[i] = fromRecord
      } else if (fromBackup) {
        result.backup[i] = fromBackup
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
          backup: null,
          status: 'idle',
        })
      }}
    >
      Reset
    </Button>
  )

  return (
    <div class="space-y-4">
      <p>Backup &amp; Restore</p>
      <Show when={state.status === 'idle'}>
        <div class="space-y-2 text-sm">
          <p>Backup</p>
          <div class="grid grid-cols-2 gap-2">
            <Button onClick={toClipboard} block>
              {copied() ? 'Copied' : 'To Clipboard'}
            </Button>
            <Button onClick={toFile} block>
              Download
            </Button>
          </div>
        </div>
        <div class="space-y-2 text-sm">
          <p>Restore</p>
          <div class="grid grid-cols-2 gap-2">
            <Button onClick={fromClipboard} block>
              From Clipboard
            </Button>
            <Button as="label" tabIndex={0}>
              From File
              <input
                ref={fileInputRef}
                type="file"
                class="sr-only"
                accept=".json"
                id="restore-file"
                tabIndex={-1}
                onInput={async event => {
                  const file = event.currentTarget?.files?.[0]
                  if (file) {
                    fromFile(file)
                  }
                }}
              />
            </Button>
            <Show when={canRestore()}>
              <Button class="col-span-full" type="button" block onClick={fromServerData}>
                From Server
              </Button>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={state.status === 'failed'}>
        <p class="text-sm">
          Failed to restore backup from <span class="capitalize">{state.source}</span>
        </p>
        <p class="text-sm">{state.message}</p>
        <Reset />
      </Show>

      <Show when={state.status === 'success'}>
        <p>Restored backup!</p>
        <Reset />
      </Show>

      <Show when={state.status === 'comparing'}>
        <div id={IDS.comparison} class="space-y-2 text-sm">
          <p>Compare and Confirm</p>

          <Collapse summary="Differences" defaultOpen>
            <Comparison
              leftTitle={'Current Data'}
              left={differences()!.record}
              rightTitle={state.source}
              right={differences()!.backup}
              fallback="No differences"
            />
          </Collapse>

          <Collapse summary="All Data">
            <Comparison
              leftTitle={'Current Data'}
              left={record()}
              rightTitle={state.source}
              right={state.backup!}
            />
          </Collapse>

          <Button block onClick={confirm}>
            Confirm
          </Button>
          <Reset />
        </div>
      </Show>
    </div>
  )
}

export default BackupRestore
