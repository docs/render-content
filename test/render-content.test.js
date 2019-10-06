'use strict'

const cheerio = require('cheerio')
const renderContent = require('..')
const { test } = require('tap')

test('renderContent', async t => {
  await t.test(
    'takes a template and a context and returns a string (async)',
    async t => {
      const template = 'my favorite color is {{ color }}.'
      const context = { color: 'orange' }
      const output = await renderContent(template, context)
      t.equal(output, '<p>my favorite color is orange.</p>')
    }
  )

  await t.test('preserves content within {% raw %} tags', async t => {
    const template = `
      For example: {% raw %}{% include cool_header.html %}{% endraw %}.
    `
    const expected = '<p>For example: {% include cool_header.html %}.</p>'
    const output = await renderContent(template)
    t.equal(output, expected)
  })

  await t.test(
    'preserves content within {% raw %} tags in data files',
    async t => {
      // see https://github.com/github/help-docs/issues/10299
      const site = {
        en: {
          site: {
            data: {
              reusables: {
                fake_reusable_file: {
                  foo: '{% raw %}{% include cool_header.html %}{% endraw %}'
                }
              }
            }
          }
        }
      }
      const template = `
      For example: {{ site.data.reusables.fake_reusable_file.foo }}.
    `
      const expected = '<p>For example: {% include cool_header.html %}.</p>'
      const context = site.en
      const output = await renderContent(template, context)

      t.equal(output, expected)
    }
  )

  await t.test(
    'removes extra newlines to prevent lists from breaking',
    async t => {
      const template = `
1. item one
1. item two


1. item three`

      const html = await renderContent(template)
      const $ = cheerio.load(html, { xmlMode: true })
      t.equal($('ol').length, 1)
      t.equal($('ol > li').length, 3)
    }
  )

  await t.test('renders text only', async t => {
    const template = 'my favorite color is {{ color }}.'
    const context = { color: 'orange' }
    const output = await renderContent(template, context, { textOnly: true })
    t.equal(output, 'my favorite color is orange.')
  })

  await t.test('throws on rendering errors', async t => {
    const template = 1
    const context = {}

    let err

    try {
      await renderContent(template, context)
    } catch (_err) {
      err = _err
    }

    t.ok(err)
  })

  await t.test(
    'warns and throws on rendering errors when the file name is passed',
    async t => {
      const template = 1
      const context = {}

      let err
      let warned = false

      const error = console.error
      console.error = message => {
        t.equal(message, 'renderContent failed on file: name')
        console.error = error
        warned = true
      }

      try {
        await renderContent(template, context, { filename: 'name' })
      } catch (_err) {
        err = _err
      }

      t.ok(err)
      t.ok(warned)
    }
  )

  await t.test('renders empty templates', async t => {
    const template = ''
    const context = {}
    const output = await renderContent(template, context)
    t.equal(output, '')
  })

  await t.test('encodes entities', async t => {
    const template = '<beep></beep>'
    const context = {}
    const output = await renderContent(template, context, {
      encodeEntities: true
    })
    t.equal(output, '&lt;p&gt;&lt;beep&gt;&lt;/beep&gt;&lt;/p&gt;')
  })

  await t.test('unwraps', async t => {
    const template = 'my favorite color is {{ color }}.'
    const context = { color: 'orange' }
    const output = await renderContent(template, context, {
      unwrap: true
    })
    t.equal(output, 'my favorite color is orange.')
  })
})
