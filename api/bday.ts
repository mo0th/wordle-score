import { isBday, verifyRequest } from './_lib'

const handler = verifyRequest(async (req, res) => {
  res.status((await isBday(req.body.user)) ? 200 : 400).end()
})

export default handler
