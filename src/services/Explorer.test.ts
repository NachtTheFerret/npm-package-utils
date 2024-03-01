import path from 'path';
import { Explorer } from './Explorer';

describe('Explorer.list', () => {
  it('should list files and folders on first level', () => {
    // /folder and /folder/ don't work because it's a absolute path
    ['./folder', 'folder', 'folder/', path.join(process.cwd(), 'folder')].forEach((to) => {
      const list = Explorer.list(to);
      expect(list).toHaveLength(5);
    });
  });

  it('should list files and folders recursively', () => {
    const list = Explorer.list('folder', { recursive: true, flatten: true });
    expect(list).toHaveLength(9);
  });

  it('should list files and folders with specific extensions', () => {
    const list = Explorer.list('folder', { extensions: ['.txt'], type: 'file' });
    expect(list).toHaveLength(1);
  });

  it('should list files and folders with specific pattern', () => {
    const list = Explorer.list('folder', { pattern: /file_a/, recursive: true, type: 'file', flatten: true });
    expect(list).toHaveLength(2);
  });

  it('should list files only', () => {
    const list = Explorer.list('folder', { type: 'file' });
    expect(list).toHaveLength(3);
  });

  it('should list folders only', () => {
    const list = Explorer.list('folder', { type: 'folder' });
    expect(list).toHaveLength(2);
  });

  it('should list files and folders with max depth', () => {
    const list = Explorer.list('folder', { recursive: true, maxDepth: 1, flatten: true });
    expect(list).toHaveLength(8);
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.list('unknown')).toThrow();
  });

  it('should throw an error if the path is a file', () => {
    expect(() => Explorer.list('folder/file_a.txt')).toThrow();
  });
});

describe('Explorer.read', () => {
  it('should read a file', () => {
    const content = Explorer.read('folder/file_a.txt');
    expect(content).toBe('File A');
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.read('unknown')).toThrow();
  });

  it('should throw an error if the path is a folder', () => {
    expect(() => Explorer.read('folder')).toThrow();
  });

  it('should encore the file with a specific encoding', () => {
    const content = Explorer.read('folder/file_a.txt', 'base64');
    expect(content).toBe('RmlsZSBB');
  });
});

describe('Explorer.exists', () => {
  it('should return true if the path exists', () => {
    expect(Explorer.exists('folder/file_a.txt')).toBe(true);
  });

  it('should return false if the path does not exist', () => {
    expect(Explorer.exists('unknown')).toBe(false);
  });
});

describe('Explorer.write', () => {
  it('should write a file', () => {
    const file = 'folder/file_b.txt';
    Explorer.write(file, 'File B');
    expect(Explorer.read(file)).toBe('File B');
  });

  it('should throw an error if the path is a folder', () => {
    expect(() => Explorer.write('folder', 'File B')).toThrow();
  });

  it('should write a file with a specific encoding', () => {
    const file = 'folder/file_b.txt';
    Explorer.write(file, 'RmlsZSBC', 'base64');
    expect(Explorer.read(file)).toBe('File B');
  });
});

describe('Explorer.delete', () => {
  it('should delete a file', () => {
    const file = 'folder/file_b.txt';
    Explorer.delete(file);
    expect(Explorer.exists(file)).toBe(false);
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.delete('unknown')).toThrow();
  });
});

describe('Explorer.import', () => {
  it('should import a file', async () => {
    expect.assertions(1);
    const content = await Explorer.import('folder/file_c.json', 'default');
    expect(content).toHaveLength(3);
  });

  it('should import a file with a specific property', async () => {
    expect.assertions(1);
    const content = await Explorer.import('folder/folder_a/file_a_a.ts', 'test');
    expect(content).toBe(1);
  });

  it('should throw an error if the path does not exist', async () => {
    await expect(Explorer.import('unknown')).rejects.toThrow();
  });
});

describe('Explorer.from', () => {
  it('should get an element from a path', () => {
    const element = Explorer.from('folder/file_a.txt');
    expect(element.name).toBe('file_a.txt');
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.from('unknown')).toThrow();
  });
});

describe('Explorer.getFolder', () => {
  it('should get the folder of a file', () => {
    const folder = Explorer.getFolder('folder/file_a.txt');
    expect(folder.name).toBe('folder');
  });

  it('should get the folder of another folder', () => {
    const folder = Explorer.getFolder('folder/folder_a');
    expect(folder.name).toBe('folder');
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.getFolder('unknown')).toThrow();
  });
});

describe('Explorer.absolute', () => {
  it('should return the absolute path', () => {
    const absolute = Explorer.absolute('folder/file_a.txt');
    expect(absolute).toBe(path.join(process.cwd(), 'folder/file_a.txt'));
  });
});

describe('Explorer.duplicate', () => {
  it('should duplicate a file', () => {
    const from = 'folder/file_a.txt';
    const to = 'folder/file_a_copy.txt';
    Explorer.duplicate(from, to);
    expect(Explorer.exists(to)).toBe(true);
    Explorer.delete(to);
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.duplicate('unknown', 'invalid')).toThrow();
  });
});

describe('Explorer.move', () => {
  it('should move a file', () => {
    const from = 'folder/file_a.txt';
    const to = 'folder/file_a_moved.txt';
    Explorer.move(from, to);
    expect(Explorer.exists(from)).toBe(false);
    expect(Explorer.exists(to)).toBe(true);
    Explorer.move(to, from);
  });

  it('should throw an error if the path does not exist', () => {
    expect(() => Explorer.move('unknown', 'invalid')).toThrow();
  });
});
