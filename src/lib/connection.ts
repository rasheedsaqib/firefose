import admin, { type ServiceAccount } from 'firebase-admin'
import { type App } from 'firebase-admin/lib/app'

/**
 * Initializes the Firebase Admin SDK with the provided service account credentials.
 * Returns the initialized Firebase app instance.
 *
 * @api public
 * @param {ServiceAccount} serviceAccount - The service account credentials to use for initializing the SDK.
 * @returns {App} The initialized Firebase app instance.
 */
const connect: (serviceAccount: ServiceAccount) => App = serviceAccount => {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

export default connect
