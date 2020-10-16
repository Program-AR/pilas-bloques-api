import { createServer, Request, disconnectDB } from './utils'


describe('Server', () => {
  let request: Request

  beforeAll(async () => {
    request = await createServer()
  })
  
  afterAll(async () => {
    await disconnectDB()
  })
  
  test('is working', () =>
    request.get('/ping').expect(200, 'pong')
  )
})