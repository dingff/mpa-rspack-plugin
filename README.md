# mpa-rspack-plugin

[![NPM version](https://img.shields.io/npm/v/mpa-rspack-plugin.svg?style=flat)](https://npmjs.org/package/mpa-rspack-plugin)

English | [简体中文](./README.zh-CN.md)

## Install

```bash
npm install --save-dev mpa-rspack-plugin
```

## Usage
This plugin will compile `*/index.[jt]sx?` file under `src/pages` directory as entry and generate corresponding HTML files for each entry file.
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
   * Pass to builtins.html, 'chunks' and 'excludedChunks' are controlled by plugin and cannot be modified
   * This configuration will apply to each page, so 'filename' is not available, you can use page-level configuration to modify it
   * Ref https://www.rspack.dev/en/config/builtins.html#builtinshtml
   */
  html: {},
  /**
   * ID of the node to be mounted during page rendering, default is 'root'
   */
  mountElementId: 'root',
  /**
   * Global dependencies that can be imported here
   * For example: ['./src/global.scss']
   */
  globalImport: [],
  /**
   * Whether to convert the output HTML filename to lowercase, default is false
   */
  lowerCase: false,
  /**
   * Layout component path
   * For example: './src/layout.jsx'
   */
  layout: '',
  /**
   * The address that will open in the browser after devServer starts
   */
  open: '',
})
```
### page-level configuration
Create `config.json` at the same level as the page component to declare page-level configuration. The page-level configuration will be merged with the global `html` configuration to generate the final configuration for the page.
```json
{
  "filename": "xxxx.html",
}
```
### layout
The page component will be passed as a child component to the `Layout` component, and global dependencies can be imported here.
```js
export default function Layout({ children }) {
  return children
}
```