import connect from '../src/lib/connect'
import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

describe('initialize', () => {
  it('should initialize firebase', () => {
    const serviceAccount = {
      project_id: process.env.PROJECT_ID as string,
      private_key: process.env.PRIVATE_KEY as string,
      client_email: process.env.CLIENT_EMAIL as string
    }

    connect(serviceAccount)

    expect(admin.apps).toHaveLength(1)
    expect(admin.apps[0]?.name).toBe('[DEFAULT]')
    expect(admin.apps[0]?.options.credential).toBeDefined()
  })
})
