import admin, { ServiceAccount } from 'firebase-admin'

export interface IServiceAccount {
  project_id: string
  client_email: string
  private_key: string
  type?: string
  private_key_id?: string
  client_id?: string
  auth_uri?: string
  token_uri?: string
  auth_provider_x509_cert_url?: string
  client_x509_cert_url?: string
}

const connect = (serviceAccount: IServiceAccount): void => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
  })
}

export default connect
