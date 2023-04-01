import { EntryObject, BuiltinsHtml, Options, PageHtml } from './types'

const { outputFileSync, readdirSync, existsSync, emptyDirSync, readJsonSync } = require('fs-extra')
const { join } = require('path')
const open = require('open')

const PLUGIN_NAME = 'MpaRspackPlugin'

class MpaRspackPlugin {
  tempDirectory = 'node_modules/.mpa'
  userOptions: Options = {}
  isOpen = false
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
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      const target = this.userOptions.open
      if (compiler.options.mode === 'production' || !target || this.isOpen) return
      this.isOpen = true
      open(target)
    })
  }
  /** 获取页面级配置 */
  getPageConfig(path: string) {
    const filePath = join(path, '../config.json')
    let config: PageHtml = {}
    if (existsSync(filePath)) {
      config = readJsonSync(filePath)
    }
    return config
  }
  getPathInJs(absPath: string) {
    return JSON.stringify(absPath).slice(1, -1)
  }
  getAbsPathForEntry(path: string) {
    let validPath = this.getPathInJs(path)
    const absPath = join(this.context, path)
    if (existsSync(absPath)) {
      validPath = this.getPathInJs(absPath)
    }
    return validPath
  }
  createTempFile(entry: EntryObject) {
    emptyDirSync(join(this.context, this.tempDirectory))
    const reactVersion = readJsonSync(join(this.context, 'package.json')).dependencies.react
    const versionReg = /(~|\\^)?18/
    const isReact18 = versionReg.test(reactVersion)
    const globalImport = this.userOptions.globalImport?.reduce((acc, curr) => {
      return `${acc}\nimport '${this.getAbsPathForEntry(curr)}';`.trimStart()
    }, '') || ''
    const { layout } = this.userOptions
    const layoutImport = layout ? `import Layout from '${this.getAbsPathForEntry(layout)}';` : ''
    const layoutJSX = layout ? '<Layout><App /></Layout>' : '<App />'
    const rootElement = `document.getElementById('${this.userOptions.mountElementId}')`
    const reactDOMSource = isReact18 ? 'react-dom/client' : 'react-dom'
    const renderer = isReact18
      ? `ReactDOM.createRoot(${rootElement}).render(${layoutJSX});`
      : `ReactDOM.render(${layoutJSX}, ${rootElement});`
    // 遍历生成文件
    Object.entries(entry).forEach(([entryName, config]: [string, any]) => {
      const filePath = join(this.context, this.tempDirectory, `${entryName}.jsx`)
      const tpl = `
// DO NOT CHANGE IT MANUALLY!
import React from 'react';
import ReactDOM from '${reactDOMSource}';
import App from '${this.getPathInJs(config.import[0])}';${layoutImport && `\n${layoutImport}`}
${globalImport}
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
        const pageConfig = this.getPageConfig(indexFilePath)
        let entryName = this.userOptions.lowerCase === true ? filename.toLowerCase() : filename
        if (pageConfig.filename) {
          entryName = pageConfig.filename.slice(0, -5)
        }
        entry[entryName] = {
          import: [indexFilePath],
        }
        if (pageConfig.template) {
          pageConfig.template = join(indexFilePath, '../', pageConfig.template)
        }
        html.push({
          template: join(__dirname, 'html.ejs'),
          ...this.userOptions.html,
          ...pageConfig,
          templateParameters: {
            ...this.userOptions.html?.templateParameters,
            ...pageConfig.templateParameters,
            mountElementId: this.userOptions.mountElementId as string,
          },
          filename: `${entryName}.html`,
          chunks: [entryName],
          excludedChunks: undefined,
        })
      }
    })
    console.log(`[MPA] Collect Entries in ${new Date().getTime() - d.getTime()}ms`)
    return { entry, html }
  }
}
module.exports = MpaRspackPlugin
