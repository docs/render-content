'use strict'

const { liquid } = require('..')
const { test } = require('tap')

test('liquid template parser', async t => {
  await t.test('custom operators', async t => {
    await t.test('ver_gt', async t => {
      await t.test('where expected value contains only a release', async t => {
        const template =
          '{% if productVersion ver_gt "2.13" %}up to date{% endif %}'

        await t.test(
          'returns true when given value is a release that is greater than',
          async t => {
            const context = {
              productVersion: '2.14'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), 'up to date')
          }
        )

        await t.test(
          'returns false when given value is a release that is equal',
          async t => {
            const context = {
              productVersion: '2.13'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is a release that is less than',
          async t => {
            const context = {
              productVersion: '2.2'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns true when given value is the same plan and a release that is greater than',
          async t => {
            const context = {
              productVersion: 'enterprise-server@2.14'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), 'up to date')
          }
        )

        await t.test(
          'returns false when given value is the same plan and a release that is equal',
          async t => {
            const context = {
              productVersion: 'enterprise-server@2.13'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is the same plan and a release that is less than',
          async t => {
            const context = {
              productVersion: 'enterprise-server@2.2'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is for a different plan',
          async t => {
            const context = {
              productVersion: 'enterprise-lgtm@2.14'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is not numeric, like `dotcom`',
          async t => {
            const context = {
              productVersion: 'dotcom'
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

      await t.test(
        'where expected value contains both a plan and a release',
        async t => {
          const template =
            '{% if productVersion ver_gt "enterprise-server@2.13" %}up to date{% endif %}'

          await t.test(
            'returns true when given value is a release that is greater than',
            async t => {
              const context = {
                productVersion: '2.14'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), 'up to date')
            }
          )

          await t.test(
            'returns false when given value is a release that is equal',
            async t => {
              const context = {
                productVersion: '2.13'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns false when given value is a release that is less than',
            async t => {
              const context = {
                productVersion: '2.2'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns true when given value is the same plan and a release that is greater than',
            async t => {
              const context = {
                productVersion: 'enterprise-server@2.14'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), 'up to date')
            }
          )

          await t.test(
            'returns false when given value is the same plan and a release that is equal',
            async t => {
              const context = {
                productVersion: 'enterprise-server@2.13'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns false when given value is the same plan and a release that is less than',
            async t => {
              const context = {
                productVersion: 'enterprise-server@2.2'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns false when given value is for a different plan',
            async t => {
              const context = {
                productVersion: 'enterprise-lgtm@2.14'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

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
        }
      )

      await t.test(
        'where expected value does not contain numbers, like `dotcom`',
        async t => {
          const template =
            '{% if productVersion ver_gt "free-pro-team" %}up to date{% endif %}'

          await t.test('returns false always', async t => {
            const context = {
              productVersion: 'free-pro-team@2.14'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          })
        }
      )
    })

    await t.test('ver_lt', async t => {
      await t.test('where expected value contains only a release', async t => {
        const template =
          '{% if productVersion ver_lt "2.13" %}out of date{% endif %}'

        await t.test(
          'returns true when given value is a release that is less than',
          async t => {
            const context = {
              productVersion: '2.2'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), 'out of date')
          }
        )

        await t.test(
          'returns false when given value is a release that is equal',
          async t => {
            const context = {
              productVersion: '2.13'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is a release that is greater than',
          async t => {
            const context = {
              productVersion: '2.14'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns true when given value is the same plan and a release that is less than',
          async t => {
            const context = {
              productVersion: 'enterprise-server@2.2'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), 'out of date')
          }
        )

        await t.test(
          'returns false when given value is the same plan and a release that is equal',
          async t => {
            const context = {
              productVersion: 'enterprise-server@2.13'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is the same plan and a release that is greater than',
          async t => {
            const context = {
              productVersion: 'enterprise-server@2.14'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is for a different plan',
          async t => {
            const context = {
              productVersion: 'enterprise-lgtm@2.2'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          }
        )

        await t.test(
          'returns false when given value is not numeric, like `dotcom`',
          async t => {
            const context = {
              productVersion: 'dotcom'
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

      await t.test(
        'where expected value contains both a plan and a release',
        async t => {
          const template =
            '{% if productVersion ver_lt "enterprise-server@2.13" %}out of date{% endif %}'

          await t.test(
            'returns true when given value is a release that is less than',
            async t => {
              const context = {
                productVersion: '2.2'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), 'out of date')
            }
          )

          await t.test(
            'returns false when given value is a release that is equal',
            async t => {
              const context = {
                productVersion: '2.13'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns false when given value is a release that is greater than',
            async t => {
              const context = {
                productVersion: '2.14'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns true when given value is the same plan and a release that is less than',
            async t => {
              const context = {
                productVersion: 'enterprise-server@2.2'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), 'out of date')
            }
          )

          await t.test(
            'returns false when given value is the same plan and a release that is equal',
            async t => {
              const context = {
                productVersion: 'enterprise-server@2.13'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns false when given value is the same plan and a release that is greater than',
            async t => {
              const context = {
                productVersion: 'enterprise-server@2.14'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

          await t.test(
            'returns false when given value is for a different plan',
            async t => {
              const context = {
                productVersion: 'enterprise-lgtm@2.2'
              }
              const output = await liquid.parseAndRender(template, context)
              t.equal(output.trim(), '')
            }
          )

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
        }
      )

      await t.test(
        'where expected value does not contain numbers, like `dotcom`',
        async t => {
          const template =
            '{% if productVersion ver_lt "free-pro-team" %}out of date{% endif %}'

          await t.test('returns false always', async t => {
            const context = {
              productVersion: 'free-pro-team@2.2'
            }
            const output = await liquid.parseAndRender(template, context)
            t.equal(output.trim(), '')
          })
        }
      )
    })
  })
})
