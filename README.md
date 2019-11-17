# @github-docs/render-content

Markdown and Liquid rendering pipeline for Node.js

## Usage

```js
const renderContent = require('@github-docs/render-content')

const html = await renderContent(`
# Beep
{{ foo }}
`, {
  foo: 'bar'
})
```

Creates:

```html
<h1 id="beep"><a href="#beep">Beep</a></h1>
<p>bar</p>
```

## Installation

```bash
$ npm install @github-docs/render-content
```

## API

### renderContent(markdown, context = {}, options = {})

Render a string of `markdown` with optional `context`. Returns a `Promise`.

Liquid will be looking for includes in `${process.cwd()}/includes`.

Options:

- `encodeEntities`: Encode html entities. Default: `false`.
- `fileName`: File name for debugging purposes.
- `textOnly`: Output text instead of html using [cheerio](https://ghub.io/cheerio).

### .liquid

The [Liquid](https://ghub.io/liquid) instance used internally.

### .liquidOcticons(string)

Render [`Octicons`](https://ghubio/@primer/octicons) in `string`. Returns a `String`.

Examples:

```md
{{ octicon-kebab-horizontal The horizontal kebab icon }}

With optional color:

{{ octicon-diff-removed The diff removed icon color-red }}
```

### .extendMarkdown(string)

Extend the following markdown tags:

- `mac`
- `windows`
- `linux`
- `all`
- `tip` (with extra styling)
- `note` (with extra styling)
- `warning` (with extra styling)
- `danger` (with extra styling)

From


```md
{{#TAG}}
content
{{/TAG}}
```

To

```html
<div class="extended-markdown TAG EXTRA_STYLING">
content
</div>
```

Returns a `String`.

## License

MIT