import Types from "../types";
import {Schema} from "../index";

class Formatable {
    static format(doc: any, schema: typeof Schema): any {

        if (!doc.exists) {
            return null;
        }

        let data = doc.data();

        Object.keys(schema.schema).forEach(key => {
            if (schema.schema[key].type === Types.ObjectId) {
                data[key] = {id: data[key]};
            }
            if (schema.schema[key].type === Types.Date) {
                data[key] = data[key].toDate();
            }
            if (schema.schema[key].type === Types.Array) {
                data[key] = data[key].map((item: any) => {
                    return Formatable.format(item, schema.schema[key].schema);
                });
            }
        })

        if (data.createdAt)
            data.createdAt = data.createdAt.toDate();
        if (data.updatedAt)
            data.updatedAt = data.updatedAt.toDate();

        return {id: doc.id, ...data};
    }
}

export = Formatable;