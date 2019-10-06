'use strict'

const { test } = require('tap')
const { liquidOcticons } = require('..')

test('liquid octicons', async t => {
  await t.test('renders liquid octicons', async t => {
    const template = '{{ octicon-kebab-horizontal The horizontal kebab icon }}'
    const output = liquidOcticons(template)
    t.ok(/svg/.test(output))
  })

  await t.test('renders liquid octicons with optional color', async t => {
    const template =
      '{{ octicon-diff-removed The diff removed icon color-red }}'
    const output = liquidOcticons(template)
    t.ok(/svg/.test(output))
    t.ok(/#cb2431/.test(output))
  })

  await t.test('warns when octicon not found', async t => {
    const template = '{{ octicon-not-found The horizontal kebab icon }}'

    const error = console.error
    console.error = message => {
      t.equal(message, "No octicon found called 'not-found'")
      console.error = error
    }

    const output = liquidOcticons(template)
    t.equal(output, 'undefined')
  })

  await t.test('warns when color not found', async t => {
    const template =
      '{{ octicon-diff-removed The diff removed icon color-not-found }}'

    const error = console.error
    console.error = message => {
      t.equal(message, 'Need to add not-found to primerColors list')
      console.error = error
    }

    const output = liquidOcticons(template)
    t.equal(output, 'undefined')
  })
})
