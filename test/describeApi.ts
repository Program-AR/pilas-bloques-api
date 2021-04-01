import { createServer, Request, dropDB, disconnectDB, initFetch, authenticate } from './utils'
import { userJson } from './sessionMock'

const describeApi = (name: string, cb: (resquest: () => Request, authenticated: (uri: string) => string) => void) => {

  describe(name, () => {
    let request: Request
    let token: string
    const authenticated = (uri: string) => authenticate(uri, token)

    beforeAll(async () => {
      request = await createServer()
    })
    beforeEach(async () => {
      initFetch()
      await dropDB()
      const { body } = await request.post('/register').send(userJson)
      token = body.token
    })
    afterAll(() => disconnectDB())

    cb(() => request, authenticated)
  })

}

export default describeApi