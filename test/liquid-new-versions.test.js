'use strict'

const { liquid } = require('..')
const { test } = require('tap')

const template = `
  {% if productVersion ver_gt "enterprise-server@2.13" %}up to date{% endif %}
  {% if productVersion ver_lt "enterprise-server@2.13" %}out of date{% endif %}
`

test('liquid template parser', async t => {
  await t.test('custom operators', async t => {
    await t.test('ver_gt', async t => {
      await t.test('works as expected', async t => {
        const context = {
          productVersion: 'enterprise-server@2.14'
        }
        const output = await liquid.parseAndRender(template, context)
        t.equal(output.trim(), 'up to date')
      })

      await t.test(
        'returns false when given value is not numeric, like `dotcom`',
        async t => {
          const context = {
            productVersion: 'free-pro-team'
          }
          const output = await liquid.parseAndRender(template, context)
          t.equal(output.trim(), '')
        }
      )

      await t.test('returns false when given value is falsy', async t => {
        const context = {}
        const output = await liquid.parseAndRender(template, context)
        t.equal(output.trim(), '')
      })
    })

    await t.test('ver_lt', async t => {
      await t.test('works as expected', async t => {
        const context = {
          productVersion: 'enterprise-server@2.12'
        }
        const output = await liquid.parseAndRender(template, context)
        t.equal(output.trim(), 'out of date')
      })
    })
  })
})
