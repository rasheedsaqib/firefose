"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const types_1 = __importDefault(require("../types"));
class Formatable {
    static format(doc, schema) {
        if (!doc.exists) {
            return null;
        }
        let data = doc.data();
        Object.keys(schema.schema).forEach(key => {
            if (schema.schema[key].type === types_1.default.ObjectId) {
                data[key] = { id: data[key] };
            }
            if (schema.schema[key].type === types_1.default.Date) {
                data[key] = data[key].toDate();
            }
            if (schema.schema[key].type === types_1.default.Array) {
                data[key] = data[key].map((item) => {
                    return Formatable.format(item, schema.schema[key].schema);
                });
            }
        });
        if (data.createdAt)
            data.createdAt = data.createdAt.toDate();
        if (data.updatedAt)
            data.updatedAt = data.updatedAt.toDate();
        return Object.assign({ id: doc.id }, data);
    }
}
module.exports = Formatable;
