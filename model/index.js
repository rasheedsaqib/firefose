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
exports.model = void 0;
const admin = require('firebase-admin');
const { Schema } = require('../schema');
const { Query } = require('../query');
const Formatable = require('../util/formatable');
class Model {
    constructor(collection, schema) {
        this.collection = collection;
        this.schema = schema;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = this.schema.validate(data);
            const doc = yield admin.firestore().collection(this.collection).add(data);
            return Object.assign({ id: doc.id }, data);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield admin.firestore().collection(this.collection).doc(id).get();
            return Formatable.format(doc, this.schema);
        });
    }
    find() {
        return new Query(this.collection, this.schema);
    }
    updateById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = this.schema.validateUpdate(data);
            if (this.schema.timestamp)
                data.updatedAt = new Date();
            yield admin.firestore().collection(this.collection).doc(id).update(data, { merge: true });
            return id;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield admin.firestore().collection(this.collection).doc(id).delete();
            return id;
        });
    }
}
const model = (collection, schema) => {
    return new Model(collection, schema);
};
exports.model = model;
