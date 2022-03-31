import { createClient } from '@supabase/supabase-js'
import { VercelApiHandler } from '@vercel/node'
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

const SLUG = process.env.VERCEL ? '~wordle-scores' : '~wordle-scores-dev'
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

type Score = { score: number; daysPlayed: number }
type Scores = Record<string, Score>
type Singleton = {
  id: number
  slug: string
  content: string
}
const ScoreSchema = types.objectWithOnlyTheseProperties({
  score: types.number,
  daysPlayed: types.number,
  uncountedFails: types.number,
})

export const getScores = async (): Promise<Scores> => {
  const { data } = await supabase
    .from<Singleton>('singletons')
    .select('*')
    .eq('slug', SLUG)
    .maybeSingle()

  if (!data) return {}

  try {
    const parsed = JSON.parse(data.content)
    const filtered = Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) =>
          typeof key === 'string' && types.isOfType(value, ScoreSchema)
      )
    ) as Scores
    return filtered
  } catch (err) {
    return {}
  }
}

const SetScoreSchema = types.objectWithOnlyTheseProperties({
  user: types.string,
  data: ScoreSchema,
})
export const setScore = async (body: unknown): Promise<boolean> => {
  if (!types.isOfType(body, SetScoreSchema)) {
    return false
  }

  const current = await getScores()

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
