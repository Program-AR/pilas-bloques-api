import * as fetchMock from 'fetch-mock'
import describeApi from './describeApi'
import { fetchCalled, fetchBodyMatch } from './utils'

const analytics = process.env.PB_ANALYTICS_URI

describeApi('Solutions', (request) => {

  beforeEach(() => {
    fetchMock.mock(`begin:${analytics}`, 200) //TODO: Move to general
  })

  test('Should mirror to analytics', () =>
    request().post('/challenges')
      .send({ test: true })
      .expect(200)
      .then(fetchCalled(analytics))
      .then(fetchBodyMatch({ test: true }))
  )

})
