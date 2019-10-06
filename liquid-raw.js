'use strict'

const liquidRaw = {}

// Mess up `raw` blocks so they'll be overlooked by the Liquid parser
// `{% raw %}` becomes `{---% raw %---}`
// `{{ foo.bar }}` becomes `{---{ foo.bar }---}`
// `{% endraw %}` becomes `{---% endraw %---}`
liquidRaw.obfuscate = template => {
  if (!template || !template.length || !template.includes('{% raw %}')) {
    return template
  }

  let withinRawBlock = false

  return template
    .trim()
    .split('\n')
    .map(line => {
      const rawBlocksStartsOnThisLine = /{% ?raw ?%}/.test(line)
      const rawBlockEndsOnThisLine = /{% ?endraw ?%}/.test(line)
      if (rawBlocksStartsOnThisLine) withinRawBlock = true
      if (withinRawBlock) {
        line = line
          .replace(/{%/g, '{---%')
          .replace(/%}/g, '%---}')
          .replace(/{{/g, '{---{')
          .replace(/}}/g, '}---}')
      }
      if (rawBlockEndsOnThisLine) withinRawBlock = false
      return line
    })
    .join('\n')
}

// Undo the effects of obfuscation, so `raw` blocks can be detected and parsed.
liquidRaw.deobfuscate = template => {
  if (!template || !template.length) return template

  let withinRawBlock = false

  return template
    .trim()
    .split('\n')
    .map(line => {
      const rawBlocksStartsOnThisLine = /{---% ?raw ?%---}/.test(line)
      const rawBlockEndsOnThisLine = /{---% ?endraw ?%---}/.test(line)
      if (rawBlocksStartsOnThisLine) withinRawBlock = true
      if (withinRawBlock) {
        line = line
          .replace(/{---%/g, '{%')
          .replace(/%---}/g, '%}')
          .replace(/{---{/g, '{{')
          .replace(/}---}/g, '}}')
      }
      if (rawBlockEndsOnThisLine) withinRawBlock = false
      return line
    })
    .join('\n')
}

module.exports = liquidRaw
