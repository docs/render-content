'use strict'

const octicons = require('@primer/octicons')

const primerColors = {
  red: '#cb2431',
  yellow: '#ffd33d',
  green: '#28a745'
}

function replaceKeywords (match, p1, p2, p3) {
  const octicon = octicons[p1]
  if (!octicon) {
    console.error(`No octicon found called '${p1}'`)
    return
  }
  const options = {}
  if (p3) {
    const color = p3.match(/^color-(.*?)$/m)
    const primerColor = primerColors[color[1]]
    if (!primerColor) {
      console.error(`Need to add ${color[1]} to primerColors list`)
      return
    }
    options.fill = primerColor
  }
  return `<span class="octicon octicon-${p1}" aria-label="${p2}" title="${p2}">${octicon.toSVG(
    options
  )}</span>`
}

// example: {{ octicon-kebab-horizontal The horizontal kebab icon }}
// with optional color: {{ octicon-diff-removed The diff removed icon color-red }}
function liquidOcticons (string) {
  const octiconRegex = /{{ ?octicon-(\S*?) (.*?) ?(color-.*?)? ?}}/gm
  string = string.replace(octiconRegex, replaceKeywords)

  return string
}

module.exports = liquidOcticons
