declare module namespace {
  /**
   * The ObjectId type
   *
   * @api public
   */
  export type ObjectId = 'ObjectId'

  /**
   * The primitive types
   * @api public
   */
  export type PrimitiveType =
    | string
    | number
    | Date
    | boolean
    | Record<string, unknown>
    | unknown[]
    | ObjectId

  /**
   * The schema types
   *
   * @api public
   */
  export type SchemaType =
    | typeof String
    | typeof Number
    | typeof Date
    | typeof Boolean
    | typeof Object
    | typeof Array
    | ObjectId

  /**
   * The field schema
   *
   * @api public
   */
  export interface FieldSchema {
    type: SchemaType
    required?: boolean
    default?: PrimitiveType | (() => PrimitiveType)
    validate?: (value: PrimitiveType) => boolean | Promise<boolean>
    ref?: string
    unique?: boolean
    immutable?: boolean
    select?: boolean
  }

  /**
   * The path definition
   *
   * @api public
   */
  export type PathDefinition<T> = FieldSchema | SchemaType | [T]

  export type SchemaStructure<T> = {
    [P in Exclude<keyof T, 'id'>]: PathDefinition<T[P]> | SchemaStructure<T[P]>
  }

  /**
   * The instance method
   *
   * @api public
   */
  export type InstanceMethod = (...arguments: unknown[]) => unknown

  export type InstanceMethods<T> = {
    [P in keyof T]: InstanceMethod
  }

  /**
   * The static method
   *
   * @api public
   */
  export type Static = (...arguments: unknown[]) => unknown

  /**
   * The virtual method
   *
   * @api public
   */
  export interface Virtual {
    get: () => unknown
    set: (value: unknown) => void
  }

  /**
   * The hook
   *
   * @api public
   */
  export interface Hook {
    pre: (next: () => void) => void
    post: (next: () => void) => void
  }

  /**
   * The schema options
   *
   * @api public
   */
  export interface SchemaOptions<U, V, W, X> {
    timestamps?: boolean
    methods?: InstanceMethods<U>
    statics?: {
      [P in keyof V]: Static
    }
    virtuals?: {
      [P in keyof W]: Virtual
    }
    hooks?: {
      [P in keyof X]: Hook
    }
  }
}
