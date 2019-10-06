'use strict'

const { test } = require('tap')
const whitespaceControl = require('../whitespace-control')

test('whitespace control', async t => {
  await t.test('no ops when no markdown was passed', async t => {
    const markdown = null
    const output = whitespaceControl(markdown)
    const expected = null
    t.equal(output, expected)
  })
  await t.test('no ops when no control characters are found', async t => {
    const markdown = 'hey _beep_ **boop**'
    const output = whitespaceControl(markdown)
    const expected = 'hey _beep_ **boop**'
    t.equal(output, expected)
  })
  await t.test('removes whitespace', async t => {
    const markdown = '{% for i in [1,2,3,4,5] -%}\n  {{ i }}\n{%- endfor %}'
    const output = whitespaceControl(markdown)
    const expected = '{% for i in [1,2,3,4,5] %}  {{ i }}{% endfor %}'
    t.equal(output, expected)
  })
})
