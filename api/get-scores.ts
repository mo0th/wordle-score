import { getScores, verifyRequest } from './_lib'

const handler = verifyRequest(async (_req, res) => {
  const scores = await getScores()
  res.json(scores)
})

export default handler
