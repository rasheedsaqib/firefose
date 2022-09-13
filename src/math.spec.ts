import { sum } from './math'

describe('Math', () => {
  it('sum', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
