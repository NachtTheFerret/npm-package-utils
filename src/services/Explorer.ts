import fs from 'fs';
import path from 'path';

/**
 * Represents a file
 */
export interface File {
  /**
   * e.g. `file.txt`
   */
  name: string;

  /**
   * e.g. `/home/user/file.txt`
   */
  path: string;

  /**
   * e.g. `file`
   */
  type: 'file';

  /**
   * e.g. `file`
   */
  basename: string;

  /**
   * e.g. `.txt`
   */
  extension?: string | null;
}

/**
 * Represents a folder
 */
export interface Folder {
  /**
   * e.g. `folder`
   */
  name: string;

  /**
   * e.g. `/home/user/folder`
   */
  path: string;

  /**
   * e.g. `folder`
   */
  type: 'folder';

  /**
   * Other files and folders inside this folder
   */
  elements: Element[];
}

/**
 * Represents a file or a folder
 */
export type Element = File | Folder;

export interface ExplorerListOptions {
  /**
   * Whether to list files and folders recursively
   */
  recursive?: boolean | null;

  /**
   * The maximum depth to list files and folders
   */
  maxDepth?: number | null;

  /**
   * The current depth to list files and folders
   */
  currentDepth?: number | null;

  /**
   * Filter files by extensions
   */
  extensions?: string[] | null;

  /**
   * Filter files by a pattern
   */
  pattern?: RegExp | null;

  /**
   * Return a flat list of files and folders
   * @default false
   */
  flatten?: boolean | null;

  /**
   * The type of the element
   * @summary
   * If it's file while recursive is true, it'll list both files and folders.
   * If it's file while recursive is false, it'll only list files.
   * If it's file while recursive and flatten are true, it'll list files only.
   * @default null
   */
  type?: 'file' | 'folder';
}

/**
 * File and folder explorer
 */
export class Explorer {
  static path = path;
  static fs = fs;

  /**
   * List files and folders
   * @param to - The path to list files and folders
   * @param options
   * @returns
   * @example
   * ```ts
   * const elements = Explorer.list('/home/user/folder', { recursive: true });
   * console.log(elements);
   * ```
   */
  static list(to: string | Folder, options?: ExplorerListOptions): Element[] {
    const t = typeof to === 'string' ? to : to.path;
    const base = Explorer.absolute(t);
    if (!Explorer.exists(base)) throw new Error(`The path "${base}" does not exist.`);
    if (!fs.lstatSync(base).isDirectory()) throw new Error(`The path "${base}" is not a folder.`);

    const recursive = options?.recursive ?? false;
    const maxDepth = options?.maxDepth ?? null;
    const currentDepth = options?.currentDepth ?? 0;
    const extensions = options?.extensions ?? null;
    const pattern = options?.pattern ?? null;
    const flatten = options?.flatten ?? false;
    const type = options?.type ?? null;

    const results = [] as Element[];

    // List files and folders
    fs.readdirSync(base).forEach((f) => {
      const t = path.join(base, f);
      const element = { name: f, path: t } as Element;

      // If it's a folder
      if (fs.lstatSync(t).isDirectory()) {
        const folder = { ...element, type: 'folder', elements: [] } as Folder;

        // List the folder recursively if needed
        if (recursive && maxDepth ? currentDepth < maxDepth : true) {
          folder.elements = Explorer.list(t, { ...options, currentDepth: currentDepth + 1 });
        }

        if (flatten) {
          if (type && type !== 'folder') results.push(...folder.elements);
          else results.push({ ...folder, elements: [] }, ...folder.elements);
        } else if (type ? type === 'folder' || recursive : true) results.push(folder);
      }

      // If it's a file
      if (fs.lstatSync(t).isFile()) {
        if (type && type !== 'file') return;
        if (extensions && !extensions.includes(path.extname(t))) return;
        if (pattern && !pattern.test(f)) return;

        results.push({
          ...element,
          type: 'file',
          basename: path.basename(t, path.extname(t)),
          extension: path.extname(t) || null,
        });
      }
    });

    return results;
  }

  /**
   * Read the content of a file
   * @param file - The path to the file
   * @param encoding - The encoding of the file
   * @returns
   * @example
   * ```ts
   * const content = Explorer.read('/home/user/file.txt');
   * console.log(content);
   * ```
   */
  static read(file: string | File, encoding: BufferEncoding = 'utf-8') {
    const t = typeof file === 'string' ? file : file.path;
    const to = Explorer.absolute(t);

    if (!Explorer.exists(to)) throw new Error(`The path "${to}" does not exist.`);
    if (!fs.lstatSync(to).isFile()) throw new Error(`The path "${to}" is not a file.`);

    return fs.readFileSync(to, encoding);
  }

  /**
   * Check if a file or a folder exists
   * @param to - The path to the file or folder
   * @returns
   * @example
   * ```ts
   * const exists = Explorer.exists('/home/user/file.txt');
   * console.log(exists);
   * ```
   */
  static exists(to: string) {
    return fs.existsSync(Explorer.absolute(to));
  }

  /**
   * Write content to a file
   * @param to - The path to the file
   * @param content - The content to write
   * @param encoding
   * @example
   * ```ts
   * Explorer.write('/home/user/file.txt', 'Hello, world!');
   * ```
   */
  static write(to: string, content: string, encoding: BufferEncoding = 'utf-8') {
    const t = Explorer.absolute(to);
    if (Explorer.exists(t) && !fs.lstatSync(t).isFile()) throw new Error(`The path "${t}" is not a file.`);

    fs.writeFileSync(to, content, encoding);
  }

  /**
   * Delete a file
   * @param to - The path to the file
   * @example
   * ```ts
   * Explorer.delete('/home/user/file.txt');
   * ```
   */
  static delete(to: string) {
    const t = Explorer.absolute(to);
    if (!Explorer.exists(t)) throw new Error(`The path "${t}" does not exist.`);

    fs.unlinkSync(t);
  }

  /**
   * Import file content
   * @param to - The path to the file
   * @param prop - The property to import
   * @returns
   * @example
   * ```ts
   * const content = await Explorer.import('/home/user/file.js');
   * console.log(content);
   * ```
   * @example
   * ```ts
   * const content = await Explorer.import('/home/user/file.ts', 'default');
   * console.log(content);
   * ```
   */
  static async import(to: string, prop?: string): Promise<any> {
    const t = Explorer.absolute(to);
    if (!Explorer.exists(t)) throw new Error(`The path "${t}" does not exist.`);
    if (!fs.lstatSync(t).isFile()) throw new Error(`The path "${t}" is not a file.`);

    const content = await import(t);
    return prop ? content[prop] : content;
  }

  /**
   * Get an element from a path
   * @param to - The path to the file or folder
   * @returns
   * @example
   * ```ts
   * const element = Explorer.from('/home/user/file.txt');
   * console.log(element);
   * ```
   */
  static from(to: string): Element {
    const t = Explorer.absolute(to);
    if (!fs.existsSync(t)) throw new Error(`The path "${t}" does not exist.`);

    const element = {
      name: path.basename(t),
      path: t,
      type: fs.lstatSync(t).isDirectory() ? 'folder' : 'file',
    } as Element;

    if (element.type === 'folder') {
      const folder = element as Folder;
      folder.elements = [];
    }

    if (element.type === 'file') {
      const file = element as File;
      file.basename = path.basename(t, path.extname(t));
      file.extension = path.extname(t);
    }

    return element;
  }

  /**
   * Get the folder from a path
   * @param from - The path to the file or folder
   * @returns
   * @example
   * ```ts
   * const folder = Explorer.getFolder('/home/user/folder/file.txt');
   * console.log(folder); // folder
   * ```
   * @example
   * ```ts
   * const folder = Explorer.getFolder({ name: 'folder', path: '/home/user/folder' });
   * console.log(folder);
   * ```
   */
  static getFolder(from: string | File): Folder {
    const p = typeof from === 'string' ? from : from.path;
    const t = Explorer.absolute(p);
    if (!fs.existsSync(t)) throw new Error(`The path "${t}" does not exist.`);

    const folder = path.dirname(t);

    return {
      name: path.basename(folder),
      path: folder,
      type: 'folder',
      elements: [],
    };
  }

  /**
   * Get an absolute path
   * @param to - The path to the file or folder
   * @returns
   * @example
   * ```ts
   * const absolute = Explorer.absolute('file.txt');
   * console.log(absolute); // /home/user/file.txt
   * ```
   * @example
   * ```ts
   * const absolute = Explorer.absolute('/home/user/file.txt');
   * console.log(absolute); // /home/user/file.txt
   * ```
   */
  static absolute(to: string) {
    return path.isAbsolute(to) ? to : path.resolve(process.cwd(), to);
  }

  /**
   * Duplicate a file or a folder
   * Can't guarantee it works for folders
   * @param from - The path to the file or folder
   * @param to - The path to the file or folder
   * @example
   * ```ts
   * Explorer.duplicate('/home/user/file.txt', '/home/user/file_copy.txt');
   * ```
   */
  static duplicate(from: string, to: string) {
    const f = Explorer.absolute(from);
    const t = Explorer.absolute(to);
    if (!Explorer.exists(f)) throw new Error(`The path "${f}" does not exist.`);
    if (Explorer.exists(t)) throw new Error(`The path "${t}" already exists.`);

    fs.copyFileSync(f, t);
  }

  /**
   * Move a file or a folder
   * @param from - The path to the file or folder
   * @param to - The path to the file or folder
   * @example
   * ```ts
   * Explorer.move('/home/user/file.txt', '/home/user/folder/file.txt');
   * ```
   */
  static move(from: string, to: string) {
    const f = Explorer.absolute(from);
    const t = Explorer.absolute(to);
    if (!Explorer.exists(f)) throw new Error(`The path "${f}" does not exist.`);
    if (Explorer.exists(t)) throw new Error(`The path "${t}" already exists.`);

    fs.renameSync(f, t);
  }
}
