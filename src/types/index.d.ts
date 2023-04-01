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
  html?: GlobalHtml;
  mountElementId?: string;
  globalImport?: string[];
  lowerCase?: boolean;
  layout?: string;
  open?: string;
}
