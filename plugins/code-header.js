const h = require('hastscript')
const octicons = require('@primer/octicons')
const parse5 = require('parse5')
const fromParse5 = require('hast-util-from-parse5')

const LANGUAGE_MAP = {
  asp: 'ASP',
  aspx: 'ASP',
  'aspx-vb': 'ASP',
  as3: 'ActionScript',
  apache: 'ApacheConf',
  nasm: 'Assembly',
  bat: 'Batchfile',
  'c#': 'C#',
  csharp: 'C#',
  c: 'C',
  'c++': 'C++',
  cpp: 'C++',
  chpl: 'Chapel',
  coffee: 'CoffeeScript',
  'coffee-script': 'CoffeeScript',
  cfm: 'ColdFusion',
  'common-lisp': 'Common Lisp',
  lisp: 'Common Lisp',
  dpatch: 'Darcs Patch',
  dart: 'Dart',
  elisp: 'Emacs Lisp',
  emacs: 'Emacs Lisp',
  'emacs-lisp': 'Emacs Lisp',
  pot: 'Gettext Catalog',
  html: 'HTML',
  xhtml: 'HTML',
  'html+erb': 'HTML+ERB',
  erb: 'HTML+ERB',
  irc: 'IRC log',
  json: 'JSON',
  jsp: 'Java Server Pages',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  lhs: 'Literate Haskell',
  'literate-haskell': 'Literate Haskell',
  objc: 'Objective-C',
  openedge: 'OpenEdge ABL',
  progress: 'OpenEdge ABL',
  abl: 'OpenEdge ABL',
  pir: 'Parrot Internal Representation',
  posh: 'PowerShell',
  puppet: 'Puppet',
  'pure-data': 'Pure Data',
  raw: 'Raw token data',
  rb: 'Ruby',
  ruby: 'Ruby',
  r: 'R',
  scheme: 'Scheme',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Shell',
  supercollider: 'SuperCollider',
  tex: 'TeX',
  ts: 'TypeScript',
  vim: 'Vim script',
  viml: 'Vim script',
  rst: 'reStructuredText',
  xbm: 'X BitMap',
  xpm: 'X PixMap',
  yaml: 'YAML',
  yml: 'YAML',

  // Unofficial languages
  shellsession: 'Shell',
  jsx: 'JSX'
}

/**
 * Adds a bar above code blocks that shows the language and a copy button
 */
module.exports = function addCodeHeader (node) {
  const hasCopy = node.lang && node.lang.endsWith('{:copy}')

  if (hasCopy && node.lang) {
    node.lang = node.lang.replace(/\{:copy\}$/, '')
  } else {
    return
  }

  const language = LANGUAGE_MAP[node.lang] || node.lang || 'Code'

  const btnIconHtml = octicons.clippy.toSVG()
  const btnIconAst = parse5.parse(String(btnIconHtml))
  const btnIcon = fromParse5(btnIconAst, btnIconHtml)

  const header = h(
    'header',
    {
      class: [
        'd-flex',
        'flex-items-center',
        'flex-justify-between',
        'p-2',
        'text-small',
        'rounded-top-1',
        'border'
      ]
    },
    [
      h('span', language),
      h(
        'button',
        {
          class: [
            'js-btn-copy',
            'btn',
            'btn-sm',
            'tooltipped',
            'tooltipped-nw'
          ],
          'data-clipboard-text': node.value,
          'aria-label': 'Copy code to clipboard'
        },
        btnIcon
      )
    ]
  )

  return {
    before: [header]
  }
}
