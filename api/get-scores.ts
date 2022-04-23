import { getScoresToDisplay, verifyRequest } from './_lib'

const handler = verifyRequest(async (req, res) => {
  const user = typeof req.headers['x-user'] === 'string' ? req.headers['x-user'] : ''
  const scores = await getScoresToDisplay(user)
  res.json(scores)
})

export default handler
