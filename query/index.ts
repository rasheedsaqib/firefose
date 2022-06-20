import {Types} from "../index";

const admin = require('firebase-admin');
const {Schema} = require('../schema');
const Formatable = require('../util/formatable');

export interface QueryType {
    field: string;
    operator: string;
    value: any;
}

export class Query {
    private conditions: QueryType[] = [];
    private populates: { doc: string, field: string }[] = [];
    private readonly collection: string;
    private readonly schema: typeof Schema;
    private orderByField?: string;
    private orderType: string = 'asc';
    private limitTo?: number;
    private offsetTo?: number;

    constructor(collection: string, schema: typeof Schema) {
        this.collection = collection;
        this.schema = schema;
    }

    where(field: string, operator: string, value: any): Query {
        this.conditions.push({field, operator, value});
        return this;
    }

    orderBy(field: string, type: string): Query {
        this.orderByField = field;
        this.orderType = type;
        return this;
    }

    limit(limitTo: number): Query {
        this.limitTo = limitTo;
        return this;
    }

    offset(offsetTo: number): Query {
        this.offsetTo = offsetTo;
        return this;
    }

    populate(field: string): Query {
        const schema = this.schema.schema[field];
        if (!schema || schema.type !== Types.ObjectId) {
            throw new Error(`Field ${field} not found or invalid type`);
        }
        this.populates.push({doc: schema.ref, field});
        return this;
    }

    async execute(): Promise<any[]> {
        let query = admin.firestore().collection(this.collection);
        this.conditions.forEach(condition => {
            query = query.where(condition.field, condition.operator, condition.value);
        });
        if (this.orderByField) {
            query = query.orderBy(this.orderByField, this.orderType);
        }
        if (this.limitTo) {
            query = query.limit(this.limitTo);
        }
        if (this.offsetTo) {
            query = query.offset(this.offsetTo);
        }

        const docs = await query.get();
        let data = docs.docs.map((doc: any) => {
            return Formatable.format(doc, this.schema);
        });

        if (this.populates.length > 0) {
            for (let populate of this.populates) {
                data = await Promise.all(data.map(async (dataRef: any) => {
                    dataRef[populate.field] = Formatable.format(await admin.firestore().collection(populate.doc).doc(dataRef[populate.field]).get(), this.schema);
                    return dataRef;
                }));
            }
        }

        return data;

    }
}