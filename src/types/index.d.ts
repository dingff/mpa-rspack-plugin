export type GlobalHtml = {
  title?: string;
  template?: string;
  templateParameters?: Record<string, string>;
  inject?: 'head' | 'body';
  publicPath?: string;
  scriptLoading?: 'blocking' | 'defer' | 'module';
  sri?: 'sha256' | 'sha384' | 'sha512';
  minify?: boolean;
  favicon?: string;
  meta?: Record<string, string | Record<string, string>>;
};
export type PageHtml = GlobalHtml & {
  filename?: string;
}
export type BuiltinsHtml = GlobalHtml & {
  filename?: string;
  chunks?: string[];
  excludedChunks?: string[];
}
type EntryItem = string | string[];

type EntryDescription = {
  import: EntryItem;
  runtime?: string | false;
};

export type EntryObject = {
  [k: string]: EntryItem | EntryDescription;
};

export type Options = {
  /**
   * 透传给 builtins.html，其中 chunks 和 excludedChunks 由插件控制，不允许修改
   * 此处配置将作用于每个页面，因此 filename 不可用，可使用页面级配置修改
   * 参考 https://www.rspack.dev/zh/config/builtins.html#builtinshtml
   */
  html?: GlobalHtml;
  /**
   * 页面渲染时，挂载到节点的 id，默认是 'root'
   */
  mountElementId?: string;
  /**
   * 可在此引入全局依赖
   * 如: ['./src/global.scss']
   */
  globalImport?: string[];
  /**
   * 是否将输出的 HTML 文件名转换为小写，默认为 false
   */
  lowerCase?: boolean;
  /**
   * 布局组件的路径
   * 如: './src/layout.jsx'
   */
  layout?: string;
  /**
   * devServer 启动后在浏览器默认打开的地址
   */
  open?: string;
}
