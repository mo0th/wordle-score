import { verifyRequest, setScore } from './_lib'

const handler = verifyRequest(async (req, res) => {
  const success = await setScore(req.body)
  res.json({ success })
})

export default handler
