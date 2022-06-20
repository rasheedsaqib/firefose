const admin = require('firebase-admin');
const {Schema} = require('../schema');
const {Query} = require('../query');
const Formatable = require('../util/formatable');

class Model {
    private readonly collection;
    private readonly schema;

    constructor(collection: string, schema: typeof Schema) {
        this.collection = collection;
        this.schema = schema;
    }

    async create(data: any): Promise<any> {
        data = this.schema.validate(data);
        const doc = await admin.firestore().collection(this.collection).add(data);
        return {id: doc.id, ...data};
    }

    async findById(id: string): Promise<any> {
        const doc = await admin.firestore().collection(this.collection).doc(id).get();
        return Formatable.format(doc, this.schema);
    }

    find(): typeof Query {
        return new Query(this.collection, this.schema);
    }

    async updateById(id: string, data: any): Promise<any> {
        data = this.schema.validateUpdate(data);
        if (this.schema.timestamp)
            data.updatedAt = new Date();
        await admin.firestore().collection(this.collection).doc(id).update(data, {merge: true});
        return id;
    }

    async deleteById(id: string): Promise<any> {
        await admin.firestore().collection(this.collection).doc(id).delete();
        return id;
    }
}

export const model = (collection: string, schema: typeof Schema): Model => {
    return new Model(collection, schema);
}