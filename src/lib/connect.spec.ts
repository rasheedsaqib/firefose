import connect from './connect'
import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

describe('initialize', () => {
  it('should initialize firebase', () => {
    const serviceAccount = {
      project_id: process.env.PROJECT_ID,
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL
    }

    connect(serviceAccount)

    expect(admin.apps).toHaveLength(1)
    expect(admin.apps[0]?.name).toBe('[DEFAULT]')
    expect(admin.apps[0]?.options.credential).toBeDefined()
  })
})
