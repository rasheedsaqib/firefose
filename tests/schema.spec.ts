import Schema, { ISchema } from '../src/lib/schema'
import SchemaTypes from '../src/schema-types'
import {describe, it, expect} from 'vitest'

describe('Schema', () => {
  it('should be able to create a schema', () => {
    const schemaObject: ISchema = {
      name: {
        type: SchemaTypes.String,
        required: true
      },
      age: {
        type: SchemaTypes.Number,
        required: true
      }
    }

    const schema = new Schema(schemaObject)

    expect(schema).toBeInstanceOf(Schema)
    expect(schema.structure).toEqual(schemaObject)
  })

  it('should be able to validate a schema for saving data', () => {
    const schemaObject: ISchema = {
      name: {
        type: SchemaTypes.String,
        required: true
      },
      age: {
        type: SchemaTypes.Number,
        required: true
      },
      posts: {
        type: SchemaTypes.Array,
        default: []
      }
    }

    const schema = new Schema(schemaObject)

    const data = {
      name: 'John',
      age: 25,
      email: 'john@gmail.com'
    }

    const validatedData = schema.validateForSaving(data)

    expect(validatedData).toBeTruthy()
    expect(validatedData).toEqual({
      name: 'John',
      age: 25,
      posts: []
    })
  })

  it('should throw invalid data error', function () {
    const schemaObject: ISchema = {
      name: {
        type: SchemaTypes.String,
        required: true
      }
    }

    const schema = new Schema(schemaObject)

    expect(() => schema.validateForSaving('John')).toThrow('Invalid data provided')
  })

  it('should throw an error of invalid type', () => {
    const schema = new Schema({
      name: {
        type: 'my-custom-type'
      }
    })

    expect(() => schema.validateForSaving({ name: 'John' })).toThrow('Invalid type for name')
  })

  it('should throw an error of missing ref', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.ObjectId
      }
    })

    expect(() => schema.validateForSaving({ name: 'John' })).toThrow('Missing ref for name')
  })

  it('should throw an error of missing required field', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String,
        required: true
      }
    })

    expect(() => schema.validateForSaving({})).toThrow('name is required')
  })

  it('should throw an error of invalid type of string while saving', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    })
    expect(() => schema.validateForSaving({ name: 123 })).toThrow('Invalid type for name. Expected value should be a string but a number is provided.')
  })

  it('should throw an error of invalid type of number while saving', () => {
    const schema = new Schema({
      age: {
        type: SchemaTypes.Number
      }
    })
    expect(() => schema.validateForSaving({ age: '12' })).toThrow('Invalid type for age. Expected value should be a number but a string is provided.')
  })

  it('should throw an error of invalid type of boolean while saving', () => {
    const schema = new Schema({
      isAdult: {
        type: SchemaTypes.Boolean
      }
    })
    expect(() => schema.validateForSaving({ isAdult: 'true' })).toThrow('Invalid type for isAdult. Expected value should be a boolean but a string is provided.')
  })

  it('should throw an error of invalid type of array while saving', () => {
    const schema = new Schema({
      posts: {
        type: SchemaTypes.Array
      }
    })
    expect(() => schema.validateForSaving({ posts: 'posts' })).toThrow('Invalid type for posts. Expected value should be an array but a string is provided.')
  })

  it('should throw an error of invalid type of object while saving', () => {
    const schema = new Schema({
      user: {
        type: SchemaTypes.Object
      }
    })
    expect(() => schema.validateForSaving({ user: 'user' })).toThrow('Invalid type for user. Expected value should be an object but a string is provided.')
  })

  it('should throw an error of invalid type of date while saving', () => {
    const schema = new Schema({
      createdAt: {
        type: SchemaTypes.Date
      }
    })
    expect(() => schema.validateForSaving({ createdAt: '2019-01-01' })).toThrow('Invalid type for createdAt. Expected value should be a Date reference but a string is provided.')
  })

  it('should add timestamps to save data', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    }, { timestamps: true })

    const validatedData = schema.validateForSaving({ name: 'John' })

    expect(validatedData).toHaveProperty('name')
    expect(validatedData).toHaveProperty('createdAt')
    expect(validatedData).toHaveProperty('updatedAt')
  })

  it('should not add timestamps to save data', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    })

    const validatedData = schema.validateForSaving({ name: 'John' })

    expect(validatedData).toHaveProperty('name')
    expect(validatedData).not.toHaveProperty('createdAt')
    expect(validatedData).not.toHaveProperty('updatedAt')
  })

  it('should add timestamps to update data', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    }, { timestamps: true })

    const validatedData = schema.validateForUpdating({ name: 'John' })

    expect(validatedData).toHaveProperty('name')
    expect(validatedData).toHaveProperty('updatedAt')
    expect(validatedData).not.toHaveProperty('createdAt')
  })

  it('should not add timestamps to update data', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    })

    const validatedData = schema.validateForUpdating({ name: 'John' })

    expect(validatedData).toHaveProperty('name')
    expect(validatedData).not.toHaveProperty('createdAt')
    expect(validatedData).not.toHaveProperty('updatedAt')
  })

  it('should throw an error if invalid data is provided for updating', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    })

    expect(() => schema.validateForUpdating('John')).toThrow('Invalid data provided')
  })

  it('should throw an error of invalid type of string while updating', () => {
    const schema = new Schema({
      name: {
        type: SchemaTypes.String
      }
    })
    expect(() => schema.validateForUpdating({ name: 123 })).toThrow('Invalid type for name. Expected value should be a string but a number is provided.')
  })

  it('should throw an error of invalid type of boolean while updating', () => {
    const schema = new Schema({
      isAdult: {
        type: SchemaTypes.Boolean
      }
    })
    expect(() => schema.validateForUpdating({ isAdult: 'true' })).toThrow('Invalid type for isAdult. Expected value should be a boolean but a string is provided.')
  })

  it('should throw an error of invalid type of number while updating', () => {
    const schema = new Schema({
      age: {
        type: SchemaTypes.Number
      }
    })
    expect(() => schema.validateForUpdating({ age: '12' })).toThrow('Invalid type for age. Expected value should be a number but a string is provided.')
  })

  it('should throw an error of invalid type of array while updating', () => {
    const schema = new Schema({
      posts: {
        type: SchemaTypes.Array
      }
    })
    expect(() => schema.validateForUpdating({ posts: 'posts' })).toThrow('Invalid type for posts. Expected value should be an array but a string is provided.')
  })

  it('should throw an error of invalid type of object while updating', () => {
    const schema = new Schema({
      user: {
        type: SchemaTypes.Object
      }
    })
    expect(() => schema.validateForUpdating({ user: 'user' })).toThrow('Invalid type for user. Expected value should be an object but a string is provided.')
  })

  it('should throw an error of invalid type of date while updating', () => {
    const schema = new Schema({
      createdAt: {
        type: SchemaTypes.Date
      }
    })
    expect(() => schema.validateForUpdating({ createdAt: '2019-01-01' })).toThrow('Invalid type for createdAt. Expected value should be a Date reference but a string is provided.')
  })
})
