// import {describe, it, expect} from "vitest";
import Schema from "../src/lib/schema";
import Model from "../src/lib/model";

//
// describe("Schema", () => {
//     it('given an empty structure, should throw error', () => {
//         expect(() => new Schema({})).toThrowError('Schema structure is empty')
//     });
//
//     it('given a structure that contains id key, should throw error', () => {
//         expect(() => new Schema({id: String})).toThrowError('Schema structure cannot contain an id field')
//     });
//
//     it('given a structure that contains type key, should throw error', () => {
//         expect(() => new Schema({type: String})).toThrowError('Schema structure cannot contain a type field')
//     });
//
//     it("given a schema structure with SchemaType, should crate a valid schema", () => {
//         const schema = new Schema({
//             name: String,
//             age: Number,
//         })
//
//         expect(schema.paths).toEqual({
//             name: {
//                 type: String,
//             },
//             age: {
//                 type: Number,
//             }
//         })
//     })
//
//     it("given a schema structure with FieldSchema, should crate a valid schema", () => {
//         const schema = new Schema({
//             name: {
//                 type: String,
//                 required: true,
//             },
//             age: {
//                 type: Number,
//                 required: true,
//             },
//         })
//
//         expect(schema.paths).toEqual({
//             name: {
//                 type: String,
//                 required: true,
//             },
//             age: {
//                 type: Number,
//                 required: true,
//             }
//         })
//
//         expect(schema.paths.name.type).toBe(String)
//         expect(schema.paths.age.type).toBe(Number)
//         expect(schema.paths.name.required).toBe(true)
//         expect(schema.paths.age.required).toBe(true)
//     })
//
//     it("given a schema with array in structure, should crate a valid schema", () => {
//         const schema = new Schema({
//             hobbies: [String],
//         })
//
//         expect(schema.paths).toEqual({
//             hobbies: [
//                 {
//                     type: String
//                 }
//             ]
//         })
//
//         expect(schema.paths.hobbies).toBeInstanceOf(Array)
//     })
//
//     it("given a schema with array in structure, should crate a valid schema", () => {
//         const schema = new Schema({
//             hobbies: [{
//                 type: String,
//                 default: [],
//             }],
//         })
//
//         expect(schema.paths).toEqual({
//             hobbies: [
//                 {
//                     type: String,
//                     default: [],
//                 }
//             ]
//         })
//         expect(schema.paths.hobbies).toBeInstanceOf(Array)
//     })
//
//     it("given a schema with nested structure, should crate a valid schema", () => {
//         const schema = new Schema({
//             address: {
//                 street: String,
//                 number: Number,
//             },
//         })
//
//         expect(schema.paths).toEqual({
//             address: {
//                 street: {
//                     type: String,
//                 },
//                 number: {
//                     type: Number,
//                 }
//             }
//         })
//     })
// })

const schema = new Schema({
    name: String,
    age: Number,
    address: {
        street: String,
        number: Number,
    }
}, {
    methods: {
        sayHello(): string {
            return `Hello ${this.name}`
        }
    }
})

const model = new Model('user', schema)

