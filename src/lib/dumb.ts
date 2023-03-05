import InstanceMethod = namespace.InstanceMethod

type SchemaMethods = Record<string, InstanceMethod>

class Schema {
  constructor(public structure: unknown, public methods: SchemaMethods) {}
}

type ModelMethods<T> = {
  [K in keyof T]: InstanceMethod
}

class Model<M extends Schema> {
  constructor(public schema: M) {
    model.initializeMethods()
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  methods: ModelMethods<M['methods']> = {} as ModelMethods<M['methods']>

  initializeMethods(): void {
    for (const methodName in this.schema.methods) {
      // const method = this.schema.methods[methodName]
      console.log(this.methods[methodName])
    }
  }
}

// Example usage
const schema = new Schema(
  {},
  {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    greet(name: string) {
      return `Hello, ${name}!`
    }
  }
)

const model = new Model(schema)

console.log(model.methods.greet('John')) // Output: "Hello, John!"
