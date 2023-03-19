export type BuiltinsHtml = {
  title?: string;
  filename?: string;
  template?: string;
  templateParameters?: Record<string, string>;
  inject?: 'head' | 'body';
  publicPath?: string;
  scriptLoading?: 'blocking' | 'defer' | 'module';
  chunks?: string[];
  excludedChunks?: string[];
  sri?: 'sha256' | 'sha384' | 'sha512';
  minify?: boolean;
  favicon?: string;
  meta?: Record<string, string | Record<string, string>>;
};

type EntryItem = string | string[];

type EntryDescription = {
  import: EntryItem;
  runtime?: string | false;
};

export type EntryObject = {
  [k: string]: EntryItem | EntryDescription;
};

export type Options = {
  html?: BuiltinsHtml;
  mountElementId?: string;
  globalImport?: string[];
}
