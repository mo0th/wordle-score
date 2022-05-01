type SyncCondition = () => boolean
const syncConditions: SyncCondition[] = []
export const shouldSync = () => syncConditions.every(fn => fn())
export const addSyncCondition = (fn: SyncCondition) => {
  syncConditions.push(fn)
}
export const removeSyncCondition = (fn: SyncCondition) => {
  const idx = syncConditions.indexOf(fn)
  if (idx !== -1) syncConditions.splice(idx, 1)
}
