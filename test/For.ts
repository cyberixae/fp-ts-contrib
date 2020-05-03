import * as assert from 'assert'
import { option, some, none } from 'fp-ts/lib/Option'
import { For } from '../src/For'

describe('For', () => {
  it('should filter options', () => {
    const foo = For(option)
      .bind('n', some(12))
      .filter(({ n }) => n < 10)
      .bindL('m', ({ n }) => some(n * 2))
      .return(({ m }) => m)

    assert.deepStrictEqual(foo, none)

    const bar = For(option)
      .bind('n', some(4))
      .filter(({ n }) => n < 10)
      .bindL('m', ({ n }) => some(n * 2))
      .return(({ m }) => m)

    assert.deepStrictEqual(bar, some(8))
  })
})
