import SchemaStructure = namespace.SchemaStructure
import SchemaOptions = namespace.SchemaOptions
import FieldSchema = namespace.FieldSchema
import InstanceMethods = namespace.InstanceMethods

type Paths = Record<
  string,
  FieldSchema | FieldSchema[] | Record<string, FieldSchema>
>

class Schema<T, U, V, W, X> {
  private readonly _paths: Paths = {}

  private readonly _options: SchemaOptions<U, V, W, X>

  /**
   * Create a new schema
   * @param {SchemaStructure} structure - The schema structure.
   * @param {SchemaOptions} options - The schema options.
   */
  constructor(
    structure: SchemaStructure<T>,
    options?: SchemaOptions<U, V, W, X>
  ) {
    this._paths = this.parse(structure)
    this._options = options ?? {}
  }

  /**
   * Parse the schema structure and create the paths
   * Returns the paths
   * @api private
   * @param {SchemaStructure} structure - The schema structure to parse.
   * @returns {Record<string, FieldSchema>} The paths.
   */
  private parse(structure: SchemaStructure<T>): Paths {
    const keys = Object.keys(structure)
    if (keys.length === 0) throw new Error('Schema structure is empty')
    if (keys.includes('id'))
      throw new Error('Schema structure cannot contain an id field')
    if (keys.includes('type'))
      throw new Error('Schema structure cannot contain a type field')

    const paths: Paths = {}

    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const value = structure[key]
      if (Array.isArray(value)) {
        paths[key] = (
          typeof value[0] === 'object'
            ? [{ ...value[0] }]
            : [
                {
                  type: value[0]
                }
              ]
        ) as FieldSchema[]
      } else if (typeof value === 'object') {
        paths[key] =
          (value as FieldSchema).type == null
            ? this.parse(value as SchemaStructure<T>)
            : {
                ...value
              }
      } else {
        paths[key] = {
          type: value
        }
      }
    }

    return paths
  }

  get options(): namespace.SchemaOptions<U, V, W, X> {
    return this._options
  }

  get methods(): InstanceMethods<U> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this._options.methods ?? ({} as InstanceMethods<U>)
  }
}

export default Schema
