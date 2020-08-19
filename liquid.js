'use strict'

const Liquid = require('liquid')
const semver = require('semver')
const path = require('path')
const engine = new Liquid.Engine()
engine.registerFileSystem(
  new Liquid.LocalFileSystem(path.join(process.cwd(), 'includes'))
)

// GHE versions are not valid SemVer, but can be coerced...
// https://github.com/npm/node-semver#coercion

Liquid.Condition.operators.ver_gt = (cond, left, right) => {
  if (!matchesVersionString(left)) return false
  return semver.gt(semver.coerce(left), semver.coerce(right))
}

Liquid.Condition.operators.ver_lt = (cond, left, right) => {
  if (!matchesVersionString(left)) return false
  return semver.lt(semver.coerce(left), semver.coerce(right))
}

module.exports = engine

function matchesVersionString (input) {
  return input && input.match(/(?:^|[a-z-]+@)?([\d.]+)/)
}
