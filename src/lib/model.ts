import type Schema from './schema'

class Model<T, U, V, W, X> {
  private readonly collection: string
  private readonly schema: Schema<T, U, V, W, X>

  constructor(collection: string, schema: Schema<T, U, V, W, X>) {
    this.collection = collection
    this.schema = schema

    this.initializeMethods()
  }

  private initializeMethods(): void {
    for (const methodName in this.schema.methods) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this[methodName] = this.schema.methods[methodName]
    }
  }
}

export default Model
