# @github-docs/render-content :sparkles: :sparkles:

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

### Code block headers

You can add a header to code blocks by adding the `{:copy}` annotation after the code fences:

    ```js{:copy}
    const copyMe = true
    ```

This renders:

![image](https://user-images.githubusercontent.com/10660468/95881747-e96c6900-0d46-11eb-9abf-1e8ad16c7646.png)

The un-highlighted text is available as `button.js-btn-copy`'s `data-clipboard-text` attribute.

## License

MIT
