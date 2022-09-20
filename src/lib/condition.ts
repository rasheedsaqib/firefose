import Operator from '../models/operator'

class Condition {
  readonly field: string
  readonly operator: Operator
  readonly value: unknown

  constructor (field: string, operator: Operator, value: unknown) {
    this.field = field
    this.operator = operator
    this.value = value
  }
}

export default Condition
