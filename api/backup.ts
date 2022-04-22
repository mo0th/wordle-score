import { backup, verifyRequest } from './_lib'

const handler = verifyRequest(async (req, res) => {
  let success = false
  if (req.method === 'POST') {
    success = await backup()
  }
  res.status(success ? 200 : 400).end()
})

export default handler
