import { describe, expect, it } from 'vitest'
import { toCsv } from './csv.js'

describe('toCsv', () => {
  it('writes headers and rows, leaving missing values empty', () => {
    const csv = toCsv(
      [{ key: 'a', header: 'A' }, { key: 'b', header: 'B' }],
      [{ a: 1, b: null }, { a: 'x,y', b: 'say "hi"' }],
    )
    expect(csv).toBe('A,B\r\n1,\r\n"x,y","say ""hi"""')
  })
})
