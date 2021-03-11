import { createServer, Request, dropDB, disconnectDB, initFetch } from './utils'
import { userJson } from './sessionMock'

const describeApi = (name: string, cb: (resquest: () => Request) => void) => {

  describe(name, () => {
    let request: Request

    beforeAll(async () => {
      request = await createServer()
    })
    beforeEach(async () => {
      initFetch()
      await dropDB()
      await request.post('/register').send(userJson)
    })
    afterAll(() => disconnectDB())

    cb(() => request)
  })

}

export default describeApi