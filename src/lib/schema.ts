import { SchemaOptions, DEFAULT_SCHEMA_OPTIONS } from '../models/schema-options'
import SchemaTypes, { Types } from '../schema-types'

export interface ISchema {
  [key: string]: {
    type: string
    required?: boolean
    default?: unknown
    ref?: string
    // todo implement following
    select?: boolean
    unique?: boolean
    immutable?: boolean
  }
}

class Schema <T> {
  readonly structure: ISchema
  readonly options: SchemaOptions

  constructor (structure: ISchema, options?: SchemaOptions) {
    this.structure = structure
    this.options = { ...DEFAULT_SCHEMA_OPTIONS, ...options }
  }

  validateForSaving (data: T): T {
    const output: T = this.validateData(data)

    if (this.options.timestamps === true) {
      // @ts-expect-error
      output.createdAt = new Date()
      // @ts-expect-error
      output.updatedAt = new Date()
    }

    return output
  }

  validateForUpdating (data: T): T {
    const output: T = this.validateData(data)

    if (this.options.timestamps === true) {
      // @ts-expect-error
      output.updatedAt = new Date()
    }

    return output
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private validateData (data: T): T {
    if (typeof data !== 'object') {
      throw new Error('Invalid data provided')
    }

    const output: T = { ...data }

    Object.keys(output as object).concat(Object.keys(this.structure)).forEach((key: string) => {
      // remove keys that are not in the schema
      if (this.structure[key] === undefined) {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete output[key]
        return
      }

      // check type validity
      if (this.structure[key].type === undefined || !Types.includes(this.structure[key].type)) {
        throw new Error(`Invalid type for ${key}`)
      }

      // check references for object id
      if (this.structure[key].type === SchemaTypes.ObjectId && this.structure[key].ref === undefined) {
        throw new Error(`Missing ref for ${key}`)
      }

      // check required fields
      // @ts-expect-error
      if ((this.structure[key].required ?? false) && (output === undefined || output[key] === undefined)) {
        throw new Error(`${key} is required`)
      }

      // pass default values
      // @ts-expect-error
      if (this.structure[key].default !== undefined && output[key] === undefined) {
        // @ts-expect-error
        output[key] = this.structure[key].default
      }

      // check string type validity
      // @ts-expect-error
      if (this.structure[key].type === SchemaTypes.String && output !== undefined && output[key] !== undefined && typeof output[key] !== 'string') {
        // @ts-expect-error
        throw new Error(`Invalid type for ${key}. Expected value should be a string but a ${typeof output[key]} is provided.`)
      }

      // check number type validity
      // @ts-expect-error
      if (this.structure[key].type === SchemaTypes.Number && output !== undefined && output[key] !== undefined && typeof output[key] !== 'number') {
        // @ts-expect-error
        throw new Error(`Invalid type for ${key}. Expected value should be a number but a ${typeof output[key]} is provided.`)
      }

      // check boolean type validity
      // @ts-expect-error
      if (this.structure[key].type === SchemaTypes.Boolean && output !== undefined && output[key] !== undefined && typeof output[key] !== 'boolean') {
        // @ts-expect-error
        throw new Error(`Invalid type for ${key}. Expected value should be a boolean but a ${typeof output[key]} is provided.`)
      }

      // check object type validity
      // @ts-expect-error
      if (this.structure[key].type === SchemaTypes.Object && output !== undefined && output[key] !== undefined && typeof output[key] !== 'object') {
        // @ts-expect-error
        throw new Error(`Invalid type for ${key}. Expected value should be an object but a ${typeof output[key]} is provided.`)
      }

      // check array type validity
      // @ts-expect-error
      if (this.structure[key].type === SchemaTypes.Array && output !== undefined && output[key] !== undefined && !Array.isArray(output[key])) {
        // @ts-expect-error
        throw new Error(`Invalid type for ${key}. Expected value should be an array but a ${typeof output[key]} is provided.`)
      }

      // check date type validity
      // @ts-expect-error
      if (this.structure[key].type === SchemaTypes.Date && output !== undefined && output[key] !== undefined && !(output[key] instanceof Date)) {
        // @ts-expect-error
        throw new Error(`Invalid type for ${key}. Expected value should be a Date reference but a ${typeof output[key]} is provided.`)
      }
    })

    return output
  }
}

export default Schema
