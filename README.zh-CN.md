# mpa-rspack-plugin

[![NPM version](https://img.shields.io/npm/v/mpa-rspack-plugin.svg?style=flat)](https://npmjs.org/package/mpa-rspack-plugin)

简体中文 | [English](./README.md)

## 安装

```bash
npm install --save-dev mpa-rspack-plugin
```

## 使用
插件会将 `src/pages` 目录下 `*/index.[jt]sx?` 文件作为 entry 进行打包，同时为每个入口文件生成相应的 HTML 文件。
```js
const MpaRspackPlugin = require('mpa-rspack-plugin')

module.exports = {
  plugins: [
    new MpaRspackPlugin(),
  ],
}
```

## 配置项

```js
new MpaRspackPlugin({
  /**
   * 透传给 builtins.html，其中 chunks 和 excludedChunks 由插件控制，不允许修改
   * 此处配置将作用于每个页面，因此 filename 不可用，可使用页面级配置修改
   * 参考 https://www.rspack.dev/zh/config/builtins.html#builtinshtml
   */
  html: {},
  /**
   * 页面渲染时，挂载到节点的 id，默认是 'root'
   */
  mountElementId: 'root',
  /**
   * 可在此引入全局依赖
   * 如: ['./src/global.scss']
   */
  globalImport: [],
  /**
   * 是否将输出的 HTML 文件名转换为小写，默认为 false
   */
  lowerCase: false,
  /**
   * 布局组件的路径
   * 如: './src/layout.jsx'
   */
  layout: '',
  /**
   * devServer 启动后在浏览器默认打开的地址
   */
  open: '',
})
```
### 页面级配置
在页面组件同层级创建 `config.json` 进行声明，页面级配置将与全局 `html` 配置合并来生成该页面最终的配置。
```json
{
  "filename": "xxxx.html",
}
```
### layout
页面组件会作为子组件传入 `Layout` 组件，可在此引入全局依赖。
```js
export default function Layout({ children }) {
  return children
}
```