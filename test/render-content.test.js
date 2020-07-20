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

  await t.test('does not render newlines around links in tables', async t => {
    const template = `
    | Keyboard shortcut | Description
    |-----------|------------
    |<kbd>g</kbd> <kbd>c</kbd> | Go to the **Code** tab
    |<kbd>g</kbd> <kbd>i</kbd> | Go to the **Issues** tab. For more information, see "[About issues](/articles/about-issues)."
    `
    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.ok(
      $.html().includes(
        '&quot;<a href="/articles/about-issues">About issues</a>.&quot;'
      )
    )
  })

  await t.test(
    'does not render newlines around inline code in tables',
    async t => {
      const template = `
    | Package manager | formats |
    | --- | --- |
    | Python | \`requirements.txt\`, \`pipfile.lock\`
    `
      const html = await renderContent(template)
      const $ = cheerio.load(html, { xmlMode: true })
      t.ok(
        $.html().includes(
          '<code>requirements.txt</code>, <code>pipfile.lock</code>'
        )
      )
    }
  )

  await t.test('does not render newlines around emphasis in code', async t => {
    const template = `
    | Qualifier        | Example
    | ------------- | -------------
    | <code>user:<em>USERNAME</em></code> | [**user:defunkt ubuntu**](https://github.com/search?q=user%3Adefunkt+ubuntu&type=Issues) matches issues with the word "ubuntu" from repositories owned by @defunkt.
    `
    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.ok($.html().includes('<code>user:<em>USERNAME</em></code>'))
  })

  await t.test('renders code blocks with # comments', async t => {
    const template = `
1. This is a list item with code containing a comment:
  \`\`\`shell
  $ foo the bar
  # some comment here
  \`\`\`
1. This is another list item.
    `
    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.equal($('ol').length, 1)
    t.ok($.html().includes('# some comment here'))
    t.notOk($.html().includes('<h1 id="some-comment-here">'))
    t.notOk($.html().includes('<a href="#some-comment-here">'))
  })

  await t.test('renders headings at the right level', async t => {
    const template = `
# This is a level one

## This is a level two

### This is a level three

#### This is a level four

##### This is a level five
`
    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.ok(
      $.html().includes(
        '<h1 id="this-is-a-level-one"><a href="#this-is-a-level-one">This is a level one</a></h1>'
      )
    )
    t.ok(
      $.html().includes(
        '<h2 id="this-is-a-level-two"><a href="#this-is-a-level-two">This is a level two</a></h2>'
      )
    )
    t.ok(
      $.html().includes(
        '<h3 id="this-is-a-level-three"><a href="#this-is-a-level-three">This is a level three</a></h3>'
      )
    )
    t.ok(
      $.html().includes(
        '<h4 id="this-is-a-level-four"><a href="#this-is-a-level-four">This is a level four</a></h4>'
      )
    )
    t.ok(
      $.html().includes(
        '<h5 id="this-is-a-level-five"><a href="#this-is-a-level-five">This is a level five</a></h5>'
      )
    )
  })

  await t.test('does syntax highlighting', async t => {
    const template = `
\`\`\`js
const example = true
\`\`\`\`
    `
    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.ok($.html().includes('<pre><code class="hljs language-js">'))
  })

  await t.test('does not autoguess code block language', async t => {
    const template = `
\`\`\`
some code
\`\`\`\
    `
    const html = await renderContent(template)
    const $ = cheerio.load(html, { xmlMode: true })
    t.ok($.html().includes('<pre><code>some code\n</code></pre>'))
  })
})
