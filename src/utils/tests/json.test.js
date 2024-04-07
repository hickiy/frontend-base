import { expect, test } from 'vitest'
import { jsonDeep } from '../json.js'
test('jsonDeep', () => {
  const json = {
    a: 1,
    b: [],
    d: { e: 3 }
  }
  const deep = 1
  const str = JSON.stringify(json, jsonDeep(deep))
  expect(str).toBe('{"a":1,"b":"null","d":"null"}')
});