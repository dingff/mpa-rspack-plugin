import { EntryObject, BuiltinsHtml, Options } from './types'

const { outputFileSync, readdirSync, existsSync, rmdirSync } = require('fs-extra')
const { join } = require('path')
const fs = require('fs')

const PLUGIN_NAME = 'MpaRspackPlugin'

class MpaRspackPlugin {
  tempDirectory = 'node_modules/.mpa'
  userOptions: Options = {}
  /** 基础目录 */
  context = ''
  constructor(options: Options) {
    this.userOptions = {
      mountElementId: 'root',
      ...options,
    }
  }
  apply(compiler: any) {
    this.context = compiler.context
    const { entry, html } = this.collectEntry()
    compiler.hooks.initialize.tap(PLUGIN_NAME, () => {
      const newEntry = this.createTempFile(entry)
      compiler.options.entry = newEntry
      compiler.options.builtins.html = html
    })
  }
  createTempFile(entry: EntryObject) {
    rmdirSync(join(this.context, this.tempDirectory), {
      force: true,
      recursive: true,
    })
    const reactVersion = JSON.parse(fs.readFileSync(join(this.context, 'package.json'), 'utf8')).dependencies.react
    const versionReg = /(~|\\^)?18/
    const isReact18 = versionReg.test(reactVersion)
    Object.entries(entry).forEach(([entryName, config]: [string, any]) => {
      const filePath = join(this.context, this.tempDirectory, `${entryName}.jsx`)
      const globalImport = this.userOptions.globalImport?.reduce((acc, curr) => {
        const path = curr.startsWith('./') ? join(this.context, curr) : curr
        return `${acc}\nimport '${path}';`.trimStart()
      }, '') || ''
      const rootElement = `document.getElementById('${this.userOptions.mountElementId}')`
      const reactDOMSource = isReact18 ? 'react-dom/client' : 'react-dom'
      const renderer = isReact18
        ? `ReactDOM.createRoot(${rootElement}).render(<App />);`
        : `ReactDOM.render(<App />, ${rootElement});`
      const tpl = `
// DO NOT CHANGE IT MANUALLY!'
import React from 'react';
import ReactDOM from '${reactDOMSource}';
import App from '${config.import[0]}';
${globalImport && `${globalImport}\n`}
${renderer}
      `.trimStart()
      outputFileSync(filePath, tpl)
      config.import[0] = filePath
    })
    return entry
  }
  collectEntry() {
    const d = new Date()
    const entry: EntryObject = {}
    const html: BuiltinsHtml[] = []
    const getIndexFilePath = (dir: string) => {
      const extensions = ['.tsx', '.jsx'] // 定义文件扩展名的数组
      // 遍历文件扩展名数组，逐个检查文件是否存在
      for (const extension of extensions) {
        const indexFilePath = join(dir, `index${extension}`)
        if (existsSync(indexFilePath)) {
          return indexFilePath // 如果文件存在，直接返回该文件的完整路径
        }
      }
      return null // 如果文件都不存在，则返回 null
    }
    const root = join(this.context, 'src', 'pages')
    readdirSync(root).forEach((filename: string) => {
      if (filename.startsWith('.')) return
      const indexFilePath = getIndexFilePath(join(root, filename))
      if (indexFilePath) {
        const entryName = this.userOptions.lowerCase === true ? filename.toLowerCase() : filename
        entry[entryName] = {
          import: [indexFilePath],
        }
        html.push({
          template: join(__dirname, 'index.ejs'),
          ...this.userOptions.html,
          templateParameters: {
            ...this.userOptions.html?.templateParameters,
            mountElementId: this.userOptions.mountElementId as string,
          },
          filename: `${entryName}.html`,
          chunks: [entryName],
        })
      }
    })
    console.log(`[MPA] Collect Entries in ${new Date().getTime() - d.getTime()}ms`)
    return { entry, html }
  }
}
module.exports = MpaRspackPlugin
