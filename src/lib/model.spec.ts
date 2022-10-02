import Model from './model'
import Schema from './schema'
import SchemaTypes from '../schema-types'
import admin from 'firebase-admin'
import connect from './connect'
import dotenv from 'dotenv'
import Query from './query'

dotenv.config()

describe('Model', () => {
  const model = new Model('test', new Schema({
    name: {
      type: SchemaTypes.String,
      required: true
    }
  }, { timestamps: true }))

  beforeEach(() => {
    if (admin.apps.length === 0) {
      connect({
        project_id: process.env.PROJECT_ID as string,
        private_key: process.env.PRIVATE_KEY as string,
        client_email: process.env.CLIENT_EMAIL as string
      })
    }
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
    // @ts-expect-error
    expect(result.id).toBe('test')
    // @ts-expect-error
    expect(result.name).toBe('Jack')
  })

  it('should find a document by id', async () => {
    const result = await model.findById('test')

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
    // @ts-expect-error
    expect(result.id).toBe('test')
  })

  it('should update a document by id', async () => {
    const result = await model.updateById('test', { name: 'John' })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    // @ts-expect-error
    expect(result.id).toBe('test')
    // @ts-expect-error
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
    const postModel = new Model('posts', new Schema({
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

    await postModel.create({
      title: 'Hello World',
      createdBy: 'test',
      savedAt: new Date()
    }, 'my-test-post')
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
    const postModel = new Model('posts', new Schema({
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

  it('should use query to update documents', async () => {
    const query = new Query()
    query.where('name', '==', 'Adil')
    const result = await model.update(query, { name: 'Adil' })

    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('name')
    // @ts-ignore
    expect(result[0]?.name).toBe('Adil')
  })

  it('should use query to delete documents', async () => {
    const query = new Query()
    query.where('name', '==', 'Jack')
    const result = await model.delete(query)

    expect(result).toBeTruthy()
  })
})
