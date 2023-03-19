# mpa-rspack-plugin
Mpa plugin for Rspack

[![NPM version](https://img.shields.io/npm/v/mpa-rspack-plugin.svg?style=flat)](https://npmjs.org/package/mpa-rspack-plugin)

## 安装

```bash
npm install mpa-rspack-plugin -D
```

## 使用
插件会将 src/pages 目录下 */index.[jt]sx? 文件作为 entry 进行打包，同时为每个入口文件生成相应的 HTML 文件。
```js
const MpaRspackPlugin = require('mpa-rspack-plugin')

module.exports = {
  plugins: [
    new MpaRspackPlugin(),
  ],
}
```

## 配置项（可选）

```js
new MpaRspackPlugin({
  /**
   * 与 builtins.html 一致
   * https://www.rspack.dev/zh/config/builtins.html#builtinshtml
   */
  html: {},
  /**
   * 页面渲染时，挂载到节点的 id，默认是 root
   */
  mountElementId: 'root',
  /**
   * 需要全局导入的依赖
   * 如 globalImport: ['./src/global.scss']，将转换为 import 'xxxxxx/src/global.scss';
   * 使用 './' 或 'src' 开头来传递相对路径，或者直接传递绝对路径
   */
  globalImport: []
})
```