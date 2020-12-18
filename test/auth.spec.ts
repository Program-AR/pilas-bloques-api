import { matchBody, hasBodyProperty } from './utils'
import { generateToken } from '../src/models/auth'
import describeApi from './describeApi'

describeApi('Users', (request) => {

  beforeEach(async () => {
    await request().post('/register').send(userJson)
  })

  test('Register', () =>
    request().post('/register')
      .send({ ...userJson, username: 'RANDOM', profile: { nickName: 'NICK' } })
      .expect(200)
      .then(matchBody({ nickName: 'NICK' }))
      .then(hasBodyProperty('token'))
  )

  test('Register missing params', () =>
    request().post('/register')
      .send({})
      .expect(400, 'Missing body parameters: credentials, profile')
  )

  // test('Register existing username', () =>
  //   request().post('/register')
  //     .send(userJson)
  //     .expect(400, 'Path `userId` is required.')
  // )

  test('Login', () =>
    request().post('/login')
      .send({ username, password })
      .expect(200)
      .then(matchBody({ nickName: userJson.profile.nickName }))
      .then(hasBodyProperty('token'))
  )

  test('Login wrong credentials', () =>
    request().post('/login')
      .send({ username: 'NOT_EXIST', password: 'WRONG' })
      .expect(400, 'Wrong credentials')
  )

  test('Profile', () =>
    request().get(`/profile?access_token=${token}`)
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

  test('Check new username', () =>
    request().get(`/register/check?username=RANDOM`)
      .send()
      .expect(200, 'true')
  )

  test('Check used username', () =>
    request().get(`/register/check?username=${username}`)
      .send()
      .expect(200, 'false')
  )

  test('Check missing parameter', () =>
    request().get(`/register/check`)
      .send()
      .expect(400, 'Missing query parameters: username')
  )

})


const username = 'USERNAME'
const password = 'PASSWORD'

const userJson = {
  credentials: {
    username,
    password,
    parentName: 'string',
    parentCUIL: 'string',

  },
  profile: {
    nickName: username,
    avatarURL: 'string'
  }
}

const token = generateToken({ username })