# mpa-rspack-plugin

[![NPM version](https://img.shields.io/npm/v/mpa-rspack-plugin.svg?style=flat)](https://npmjs.org/package/mpa-rspack-plugin)

## How it works
It will collect `*/index.[jt]sx?` files under `src/pages` directory as entries, and generate corresponding HTML file for each entry.
## Install
```bash
npm install --save-dev mpa-rspack-plugin
```
## Usage
```js
const MpaRspackPlugin = require('mpa-rspack-plugin')

module.exports = {
  plugins: [
    new MpaRspackPlugin(),
  ],
}
```

## Options
```js
new MpaRspackPlugin({
  /**
   * Pass to builtins.html, 'chunks' and 'excludedChunks' are controlled by plugin and cannot be modified.
   * This configuration will apply to each page, so 'filename' is not available, you can use page-level configuration to modify it.
   * Ref https://www.rspack.dev/en/config/builtins.html#builtinshtml
   */
  html: {},
  /**
   * ID of the node to be mounted during page rendering.
   * @default 'root'
   */
  mountElementId: 'root',
  /**
   * The paths of the global dependencies.
   * For example: ['./src/global.scss']
   */
  globalImport: [],
  /**
   * Whether to convert the output HTML filename to lowercase.
   * @default false
   */
  lowerCase: false,
  /**
   * The path of the layout component.
   * For example: './src/layout.jsx'
   */
  layout: '',
  /**
   * The address that will open in the browser after devServer starts.
   */
  open: '',
})
```
### The page-level configuration
Create `config.json` at the same level as the page component to declare page-level configuration. The page-level configuration will be merged with the global `html` configuration to generate the final configuration for the page.
```json
{
  "filename": "xxxx.html",
}
```
### Layout
The page component will be passed as a child component to the `Layout` component, and global dependencies can be imported here.
```js
export default function Layout({ children }) {
  return children
}
```