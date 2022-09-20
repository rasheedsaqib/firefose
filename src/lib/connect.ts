import admin, { ServiceAccount } from 'firebase-admin'

export interface IServiceAccount {
  project_id?: string
  client_email?: string
  private_key?: string
}

const connect = (serviceAccount: IServiceAccount): void => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
  })
}

export default connect
