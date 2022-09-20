import Schema from './schema'
import admin from 'firebase-admin'
import SchemaTypes from '../schema-types'
import Query from './query'

class Model <T> {
  private readonly collection: string
  private readonly schema: Schema<T>

  constructor (collection: string, schema: Schema<T>) {
    this.collection = collection
    this.schema = schema
  }

  async create (data: T, doc?: string): Promise<T> {
    const validatedData: T = this.schema.validateForSaving(data)

    let output: T

    if (doc !== undefined) {
      // @ts-expect-error
      output = (await admin.firestore().collection(this.collection).doc(doc).set(validatedData)) as T
    } else {
      // @ts-expect-error
      output = (await admin.firestore().collection(this.collection).add(validatedData)) as T
    }
    // @ts-expect-error
    return { id: doc ?? output.id, ...validatedData }
  }

  async findById (id: string): Promise<T> {
    const doc = await admin.firestore().collection(this.collection).doc(id).get()

    return this.format(doc)
  }

  async find (query: Query): Promise<T[]> {
    let firestoreQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = admin.firestore().collection(this.collection)

    if (query.conditions.length > 0) {
      query.conditions.forEach(condition => {
        firestoreQuery = firestoreQuery.where(condition.field, condition.operator, condition.value)
      })
    }

    if (query.orderField !== undefined) {
      firestoreQuery = firestoreQuery.orderBy(query.orderField.field, query.orderField?.type)
    }

    if (query.limitTo !== undefined) {
      firestoreQuery = firestoreQuery.limit(query.limitTo)
    }

    if (query.offsetTo !== undefined) {
      firestoreQuery = firestoreQuery.offset(query.offsetTo)
    }

    let data: T[] = (await firestoreQuery.get()).docs.map(doc => this.format(doc))

    if (query.populateOn.length > 0) {
      data = await Promise.all(data.map(async item => {
        const populatedItem = { ...item }

        for (const field of query.populateOn) {
          // @ts-expect-error
          populatedItem[field] = this.format((await admin.firestore().collection(this.schema.structure[field].ref as string).doc(item[field]).get()))
        }

        return populatedItem
      }))
    }

    return data
  }

  async updateById (id: string, data: T): Promise<T> {
    const validatedData: T = this.schema.validateForUpdating(data)

    // @ts-expect-error
    await admin.firestore().collection(this.collection).doc(id).update(validatedData)

    return { id, ...validatedData }
  }

  async deleteById (id: string): Promise<string> {
    await admin.firestore().collection(this.collection).doc(id).delete()
    return id
  }

  private format (doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): T {
    if (!doc.exists) {
      return null as T
    }

    const data = doc.data() as T

    Object.keys(this.schema.structure).forEach(key => {
      // @ts-expect-error
      if (this.schema.structure[key].type === SchemaTypes.Date && data[key] !== undefined) {
        // @ts-expect-error
        data[key] = data[key].toDate()
      }
    })

    // @ts-expect-error
    if (this.schema.options.timestamps === true && data.createdAt !== undefined) {
      // @ts-expect-error
      data.createdAt = data.createdAt.toDate()
    }
    // @ts-expect-error
    if (this.schema.options.timestamps === true && data.updatedAt !== undefined) {
      // @ts-expect-error
      data.updatedAt = data.updatedAt.toDate()
    }

    return { id: doc.id, ...data }
  }
}

export default Model