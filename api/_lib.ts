import { createClient } from '@supabase/supabase-js'
import { VercelApiHandler } from '@vercel/node'
import { utcToZonedTime } from 'date-fns-tz'
import * as types from 'pheno'

export const SECRET = process.env.SECRET

type ApiWrapper = (h: VercelApiHandler) => VercelApiHandler

export const verifyRequest: ApiWrapper = handler => {
  return async (req, res) => {
    const secret = req.headers['authorization']?.replace('Bearer ', '')
    if (secret !== SECRET) {
      res.status(401).end()
      return
    }
    await handler(req, res)
  }
}

const isProd = Boolean(process.env.VERCEL)
const SLUG = isProd ? '~wordle-scores' : '~wordle-scores-dev'
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

type Score = { score: number; daysPlayed: number }
type Scores = Record<string, Score>
type Singleton = {
  id: number
  slug: string
  content: string
}

const _ScoreSchema = {
  score: types.number,
  daysPlayed: types.number,
  uncountedFails: types.number,
}

const ScoreSchema = types.objectWithProperties(_ScoreSchema)

const getScoresWithAllRecords = async (): Promise<Scores> => {
  const { data } = await supabase
    .from<Singleton>('singletons')
    .select('*')
    .eq('slug', SLUG)
    .maybeSingle()

  if (!data) return {}

  try {
    const parsed = JSON.parse(data.content)
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) => typeof key === 'string' && types.isOfType(value, ScoreSchema)
      )
    ) as Scores
  } catch (err) {
    console.log(err)
    return {}
  }
}

export const getScores = async (user: string): Promise<Scores> => {
  const scoresWithAllRecords = await getScoresWithAllRecords()
  return Object.fromEntries(
    Object.entries(scoresWithAllRecords).map(([key, value]: [string, any]) => {
      const { record: _, ...valueWithoutRecord } = value
      const newValue = user === key ? value : valueWithoutRecord
      return [key, newValue]
    })
  ) as Scores
}

const SetScoreSchema = types.objectWithOnlyTheseProperties({
  user: types.string,
  data: types.intersection(
    ScoreSchema,
    types.partialObjectWithProperties({
      history: types.record(types.string, types.or(types.string, types.number)),
    })
  ),
})
export const setScore = async (body: unknown): Promise<boolean> => {
  if (!types.isOfType(body, SetScoreSchema)) {
    return false
  }

  const current = await getScoresWithAllRecords()

  if (body.data.daysPlayed === 0) {
    delete current[body.user]
  } else {
    current[body.user] = body.data
  }

  const { error } = await supabase
    .from<Singleton>('singletons')
    .update({ content: JSON.stringify(current, null, 2) })
    .eq('slug', SLUG)
    .maybeSingle()

  if (error) return false

  return true
}

export const isBday = async (name: string): Promise<boolean> => {
  const { data } = await supabase
    .from<Singleton>('singletons')
    .select('*')
    .eq('slug', '~wordle-scores-bdays')
    .maybeSingle()

  if (!data) return false

  const [_, dateStr] =
    data.content
      .trim()
      .split('\n')
      .map(line => {
        const parts = line.split(',')
        const dateStr = parts.pop()
        return [parts.join(','), dateStr]
      })
      .find(([n]) => n === name) || []

  if (!dateStr) return false

  const [_d, _m] = dateStr.split('/')
  const d = parseInt(_d)
  const m = parseInt(_m)
  const dateInAus = utcToZonedTime(new Date(), 'Australia/Sydney')
  return dateInAus.getDate() === d && dateInAus.getMonth() === m - 1
}

export const backup = async (): Promise<boolean> => {
  const date = new Date().toISOString()

  const filename = `${date}${isProd ? '' : '--dev'}.json`

  const data = JSON.stringify(await getScoresWithAllRecords())
  const result = await supabase.storage
    .from('wordle-score-backups')
    .upload(filename, data, { contentType: 'application/json' })

  if (result.error) return false
  return true
}
