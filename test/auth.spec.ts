import describeApi from './describeApi'
import { matchBody, hasBodyProperty } from './utils'
import { userJson, username, password, parentCUIL } from './sessionMock'

describeApi('Users', (request, authenticated) => {

  describe('POST /register', () => {
    test('Do register', () =>
      request().post('/register')
        .send({ ...userJson, username: 'RANDOM', profile: { nickName: 'NICK' } })
        .expect(200)
        .then(matchBody({ nickName: 'NICK' }))
        .then(hasBodyProperty('id'))
        .then(hasBodyProperty('token'))
        .then(hasBodyProperty('answeredQuestionIds'))
    )

    test('Register fails for required attributes', () =>
      request().post('/register')
        .send({ username, password })
        .expect(400, 'Path `parentCUIL` is required.\nPath `parentName` is required.')
    )

    // SKIP: Not working in testing enviroment
    test.skip('Register existing username', () =>
      request().post('/register')
        .send(userJson)
        .expect(400, 'Duplicate key error.')
    )
  })


  describe('POST /login', () => {
    test('Do login', () =>
      request().post('/login')
        .send({ username, password })
        .expect(200)
        .then(matchBody({ nickName: userJson.profile.nickName }))
        .then(hasBodyProperty('id'))
        .then(hasBodyProperty('token'))
        .then(hasBodyProperty('answeredQuestionIds'))
    )

    test('Login wrong credentials', () =>
      request().post('/login')
        .send({ username: 'NOT_EXIST', password: 'WRONG' })
        .expect(400, 'Wrong credentials')
    )

    test('Login missing params', () =>
      request().post('/login')
        .send({})
        .expect(400, 'Missing body parameters: username, password')
    )
  })


  describe('PUT /credentials', () => {
    test('Change credentials', async () => {
      await request().put('/credentials')
        .send({ username, parentCUIL, password: "NEW PASSWORD" })
        .expect(200)
        .then(hasBodyProperty('token'))

      await request().post('/login')
        .send({ username, password: "NEW PASSWORD" })
        .expect(200)
    })

    test('Change credentials fails', () =>
      request().put('/credentials')
        .send({ username, parentCUIL: 'WRONG', password })
        .expect(400, 'Wrong credentials')
    )
  })


  describe('GET /profile', () => {
    test('Profile', () =>
      request().get(authenticated(`/profile`))
        .send()
        .expect(200)
        .then(matchBody(userJson.profile))
    )

    test('Profile missing access token', () =>
      request().get(`/profile`)
        .send()
        .expect(400, 'Missing access token')
    )

    test('Profile unauthorized', () =>
      request().get(`/profile?access_token=FAKE`)
        .send()
        .expect(401, 'Unauthorized')
    )
  })


  describe('GET /users/exists', () => {
    test('Check new username', () =>
      request().get(`/users/exists?username=RANDOM`)
        .send()
        .expect(200, 'false')
    )

    test('Check used username', () =>
      request().get(`/users/exists?username=${username}`)
        .send()
        .expect(200, 'true')
    )

    test('Check missing parameter', () =>
      request().get(`/users/exists`)
        .send()
        .expect(400, 'Missing query parameters: username')
    )
  })

  test('POST /answers', () =>
    request().post(authenticated(`/answers`))
      .send({ question: { id: 1 }, response: { text: "RESPONSE" } })
      .expect(200)
      .then(matchBody({ answeredQuestionIds: [1] }))
  )
})
