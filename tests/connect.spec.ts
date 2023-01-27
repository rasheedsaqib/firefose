import connect from '../src/lib/connect'
import { describe, it, expect, vi } from 'vitest'

const PROJECT_ID = 'test-project'
const CLIENT_EMAIL = 'test@firebase.com'
const PRIVATE_KEY = 'test'

vi.mock('firebase-admin', () => ({
  default: {
    initializeApp: () => ({
      name: '[DEFAULT]',
      options: {
        credential: {
          projectId: PROJECT_ID,
          clientEmail: CLIENT_EMAIL,
          private_key: PRIVATE_KEY
        }
      }
    }),
    credential: {
      cert: () => ({
        projectId: PROJECT_ID,
        clientEmail: CLIENT_EMAIL,
        private_key: PRIVATE_KEY
      })
    }
  }
}))

describe('initialize', () => {
  it('should initialize firebase', () => {
    const serviceAccount = {
      project_id: PROJECT_ID,
      private_key: PRIVATE_KEY,
      client_email: CLIENT_EMAIL
    }

    const app = connect(serviceAccount)

    expect(app).toBeDefined()
    expect(app).toHaveProperty('name', '[DEFAULT]')
    expect(app).toHaveProperty('options.credential.projectId', PROJECT_ID)
    expect(app).toHaveProperty('options.credential.clientEmail', CLIENT_EMAIL)
    expect(app).toHaveProperty('options.credential.private_key', PRIVATE_KEY)
  })
})
