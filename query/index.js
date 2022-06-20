"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const index_1 = require("../index");
const admin = require('firebase-admin');
const { Schema } = require('../schema');
const Formatable = require('../util/formatable');
class Query {
    constructor(collection, schema) {
        this.conditions = [];
        this.populates = [];
        this.orderType = 'asc';
        this.collection = collection;
        this.schema = schema;
    }
    where(field, operator, value) {
        this.conditions.push({ field, operator, value });
        return this;
    }
    orderBy(field, type) {
        this.orderByField = field;
        this.orderType = type;
        return this;
    }
    limit(limitTo) {
        this.limitTo = limitTo;
        return this;
    }
    offset(offsetTo) {
        this.offsetTo = offsetTo;
        return this;
    }
    populate(field) {
        const schema = this.schema.schema[field];
        if (!schema || schema.type !== index_1.Types.ObjectId) {
            throw new Error(`Field ${field} not found or invalid type`);
        }
        this.populates.push({ doc: schema.ref, field });
        return this;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const docs = yield query.get();
            let data = docs.docs.map((doc) => {
                return Formatable.format(doc, this.schema);
            });
            if (this.populates.length > 0) {
                for (let populate of this.populates) {
                    data = yield Promise.all(data.map((dataRef) => __awaiter(this, void 0, void 0, function* () {
                        dataRef[populate.field] = Formatable.format(yield admin.firestore().collection(populate.doc).doc(dataRef[populate.field]).get(), this.schema);
                        return dataRef;
                    })));
                }
            }
            return data;
        });
    }
}
exports.Query = Query;
