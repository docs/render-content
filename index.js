'use strict'

const liquid = require('./liquid')
const hubdown = require('hubdown')
const extendMarkdown = require('./extend-markdown')
const whitespaceControl = require('./whitespace-control')
const liquidRaw = require('./liquid-raw')
const liquidOcticons = require('./liquid-octicons')
const cheerio = require('cheerio')
const Entities = require('html-entities').XmlEntities
const entities = new Entities()
const stripHtmlComments = require('strip-html-comments')

// used below to remove unwanted newlines
const inlineTags = '(?:a|code|em)'
const inlineTagRegex = new RegExp(`\n?(</?${inlineTags}>?)\n?`, 'gm')

// parse multiple times because some templates contain more templates. :]
module.exports = async function renderContent (
  template,
  context = {},
  options = {}
) {
  try {
    if (template) template = stripHtmlComments(template)

    template = whitespaceControl(template)

    // obfuscate {% raw %} blocks so they won't be 'overparsed'
    template = liquidRaw.obfuscate(template)

    template = await liquid.parseAndRender(template, context)

    // obfuscate any {% raw %} blocks in data files that have just been parsed into the template
    template = liquidRaw.obfuscate(template)

    // this is run after the first liquid pass to
    // find any extended markdown within reusables
    template = extendMarkdown(template)

    // this is run after the first liquid pass to
    // find any octicons within reusables
    template = liquidOcticons(template)

    template = await liquid.parseAndRender(template, context)

    // de-obfuscate {% raw %} blocks before the final liquid pass
    template = liquidRaw.deobfuscate(template)

    template = await liquid.parseAndRender(template, context)

    // this workaround loses syntax highlighting but correctly handles tags like <em> and entities like &lt;
    template = template.replace(
      /``` ?shell\n\s*?(\S[\s\S]*?)\n.*?```/gm,
      '<pre><code class="hljs language-shell">$1</code></pre>'
    )

    // this removes any extra newlines left by (now resolved) liquid
    // statements so that extra space doesn't mess with list numbering
    template = template.replace(/\n\n\n/g, '\n\n')

    let { content: html } = await hubdown(template)

    // Remove unwanted newlines (which appear as spaces) from inline tags inside tables
    html = html.replace(inlineTagRegex, '$1')

    if (options.textOnly) {
      html = cheerio
        .load(html)
        .text()
        .trim()
    }

    if (options.encodeEntities) html = entities.encode(html)

    return html.trim()
  } catch (error) {
    if (options.filename) {
      console.error(`renderContent failed on file: ${options.filename}`)
    }
    throw error
  }
}

Object.assign(module.exports, {
  liquid,
  liquidOcticons,
  extendMarkdown
})
