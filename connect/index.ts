const admin = require('firebase-admin');

interface credential {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}

export const connect = async (credential: credential, databaseURI: string): Promise<void> => {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(credential),
            databaseURL: databaseURI
        });

        return;

    }catch (e){
        throw e;
    }
}