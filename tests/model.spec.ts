import Model from '../src/lib/model'
import Schema from '../src/lib/schema'
import SchemaTypes from '../src/schema-types'
import Query from '../src/lib/query'
import { describe, it, expect, vi } from 'vitest'

vi.mock('firebase-admin', () => ({
  default: {
    firestore: () => ({
      collection: () => ({
        add: () => Promise.resolve({ id: 'test2' }),
        doc: (id: string) => ({
          set: () => Promise.resolve({ id: 'test' }),
          get: () => {
            if (id === 'test') {
              return Promise.resolve({
                id: 'test',
                exists: true,
                data: () => ({
                  name: 'Jack',
                  createdAt: {
                    toDate: () => new Date()
                  },
                  updatedAt: {
                    toDate: () => new Date()
                  }
                })
              })
            } else if (id === 'my-test-post') {
              return Promise.resolve({
                id: 'my-test-post',
                exists: true,
                data: () => ({
                  title: 'My Test Post',
                  createdBy: 'test',
                  savedAt: {
                    toDate: () => new Date()
                  }
                })
              })
            } else if (id === 'testCreated') {
              return Promise.resolve({
                id: 'testCreated',
                exists: true,
                data: () => ({
                  name: 'name'
                })
              })
            } else {
              return Promise.resolve({
                id: 'test3',
                exists: false,
                data: () => null
              })
            }
          },
          update: () => Promise.resolve({ id: 'test' }),
          delete: () => Promise.resolve()
        }),
        where: (key: string) => ({
          orderBy: () => ({
            limit: () => ({
              offset: () => ({
                get: () => Promise.resolve({
                  docs: [
                    {
                      id: 'test',
                      exists: true,
                      data: () => ({
                        name: 'name'
                      })
                    }
                  ]
                })
              })
            })
          }),
          get: () => {
            if (key === 'name') {
              return Promise.resolve({
                docs: [
                  {
                    id: 'test',
                    exists: true,
                    data: () => ({
                      name: 'Name2'
                    })
                  }
                ]
              })
            } else {
              return Promise.resolve({
                docs: [
                  {
                    id: 'post1',
                    exists: true,
                    data: () => ({
                      title: 'title',
                      createdBy: 'testCreated',
                      savedAt: {
                        toDate: () => new Date()
                      }
                    })
                  }
                ]
              })
            }
          }
        }),
        limit: () => ({
          get: () => Promise.resolve({
            docs: [
              {
                id: 'test',
                exists: true,
                data: () => ({
                  name: 'name'
                })
              },
              {
                id: 'test',
                exists: true,
                data: () => ({
                  name: 'name'
                })
              }
            ]
          })
        }),
        get: () => Promise.resolve({
          docs: [
            {
              id: 'test',
              exists: true,
              data: () => ({
                name: 'NameUpdated'
              })
            },
            {
              id: 'test',
              exists: true,
              data: () => ({
                name: 'NameUpdated'
              })
            }
          ]
        })
      })
    })
  }
}))

describe('Model', () => {
  let model: Model<any>
  let postModel: Model<any>

  beforeEach(() => {
    model = new Model('test', new Schema({
      name: {
        type: SchemaTypes.String,
        required: true
      }
    }, { timestamps: true }))
    postModel = new Model('posts', new Schema({
      title: {
        type: SchemaTypes.String,
        required: true
      },
      createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'test'
      },
      savedAt: {
        type: SchemaTypes.Date,
        required: true
      }
    }))
  })

  it('should create a model', function () {
    expect(model).toBeDefined()
  })

  it('should create a document without doc reference', async () => {
    const result = await model.create({ name: 'Jack' })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
  })

  it('should create a document with doc reference', async () => {
    const result = await model.create({ name: 'Jack' }, 'test')

    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result.id).toBe('test')
    expect(result.name).toBe('Jack')
  })

  it('should find a document by id', async () => {
    const result = await model.findById('test')

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
    expect(result.id).toBe('test')
  })

  it('should update a document by id', async () => {
    const result = await model.updateById('test', { name: 'John' })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result.id).toBe('test')
    expect(result.name).toBe('John')
  })

  it('should delete a document by id', async () => {
    const result = await model.deleteById('test2')

    expect(result).toBe('test2')
  })

  it('should find a document that doesn\'t exist', async () => {
    const result = await model.findById('test3')

    expect(result).toBeNull()
  })

  it('should test dates and references', async () => {
    const result = await postModel.findById('my-test-post')

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('createdBy')
    expect(result).toHaveProperty('savedAt')
  })

  it('should use query to find documents', async () => {
    const query = new Query()
    query.where('name', '==', 'Adil')
      .limit(1)
      .offset(0)
      .orderBy('createdAt', 'asc')
    const result = await model.find(query)

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('name')
  })

  it('should limit documents to 2', async () => {
    const query = new Query()
    query.limit(2)
    const result = await model.find(query)

    expect(result).toHaveLength(2)
  })

  it('should use query to find documents with populate', async () => {
    const query = new Query()
    query.where('title', '==', 'Hello World Test').populate('createdBy')
    const result = await postModel.find(query)

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('title')
    expect(result[0]).toHaveProperty('createdBy')
    expect(result[0]).toHaveProperty('savedAt')
    // @ts-ignore
    expect(result[0]?.createdBy).toHaveProperty('id')
    // @ts-ignore
    expect(result[0]?.createdBy).toHaveProperty('name')
  })

  it('should update all documents', async () => {
    const query = new Query()
    const result = await model.update(query, { name: 'Name2' })

    expect(result).toHaveLength(2)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('name')
    // @ts-ignore
    expect(result[0]?.name).toBe('NameUpdated')
  })

  it('should use query to update documents', async () => {
    const query = new Query()
    query.where('name', '==', 'Name1')
    const result = await model.update(query, { name: 'Name2' })

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('name')
    // @ts-ignore
    expect(result[0]?.name).toBe('Name2')
  })

  it('should delete all documents', async () => {
    const query = new Query()
    const result = await model.delete(query)

    expect(result).toHaveLength(2)
  })

  it('should use query to delete documents', async () => {
    const query = new Query()
    query.where('name', '==', 'Jack')
    const result = await model.delete(query)

    expect(result).toBeTruthy()
  })

})
