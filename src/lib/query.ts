import Condition from './condition'
import { OrderBy } from '../models/order-by'
import Operator from '../models/operator'

class Query {
  readonly conditions: Condition[] = []
  readonly populateOn: string[] = []
  orderField?: OrderBy
  limitTo?: number
  offsetTo?: number

  where (field: string, operator: Operator, value: unknown): Query {
    this.conditions.push(new Condition(field, operator, value))
    return this
  }

  orderBy (field: string, type: 'asc' | 'desc'): Query {
    this.orderField = { field, type }
    return this
  }

  limit (limit: number): Query {
    this.limitTo = limit
    return this
  }

  offset (offsetTo: number): Query {
    this.offsetTo = offsetTo
    return this
  }

  populate (field: string): Query {
    this.populateOn.push(field)
    return this
  }
}

export default Query
