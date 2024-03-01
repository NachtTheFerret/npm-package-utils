import { Text } from './Text';

describe('Text.var', () => {
  const variables = {
    foo: 'bar',
    baz: {
      qux: 'quux',
    },
  };

  it('should return the same text if no variables are provided', () => {
    expect(Text.var('Hello, world!')).toBe('Hello, world!');
  });

  it('should replace variables in the text', () => {
    expect(Text.var('Hello, {foo}!', variables)).toBe('Hello, bar!');
    expect(Text.var('Hello, {baz.qux}!', variables)).toBe('Hello, quux!');
  });
});

describe('Text.capitalize', () => {
  it('should capitalize the first letter of the text', () => {
    expect(Text.capitalize('hello, world!')).toBe('Hello, world!');
  });

  it('should capitalize the first letter of each word in the text', () => {
    expect(Text.capitalize('hello, world!', true)).toBe('Hello, World!');
  });
});

describe('Text.case', () => {
  it('should convert the text from camelCase to snake_case', () => {
    expect(Text.case('helloWorld', 'camelCase', 'snake_case')).toBe('hello_world');
  });

  it('should convert the text from camelCase to kebab-case', () => {
    expect(Text.case('helloWorld', 'camelCase', 'kebab-case')).toBe('hello-world');
  });

  it('should convert the text from camelCase to PascalCase', () => {
    expect(Text.case('helloWorld', 'camelCase', 'PascalCase')).toBe('HelloWorld');
  });

  it('should convert the text from camelCase to CONSTANT_CASE', () => {
    expect(Text.case('helloWorld', 'camelCase', 'CONSTANT_CASE')).toBe('HELLO_WORLD');
  });

  it('should convert the text from camelCase to Title Case', () => {
    expect(Text.case('helloWorld', 'camelCase', 'Title Case')).toBe('Hello World');
  });

  it('should convert the text from snake_case to camelCase', () => {
    expect(Text.case('hello_world', 'snake_case', 'camelCase')).toBe('helloWorld');
  });

  it('should convert the text from snake_case to kebab-case', () => {
    expect(Text.case('hello_world', 'snake_case', 'kebab-case')).toBe('hello-world');
  });

  it('should convert the text from snake_case to PascalCase', () => {
    expect(Text.case('hello_world', 'snake_case', 'PascalCase')).toBe('HelloWorld');
  });

  it('should convert the text from snake_case to CONSTANT_CASE', () => {
    expect(Text.case('hello_world', 'snake_case', 'CONSTANT_CASE')).toBe('HELLO_WORLD');
  });

  it('should convert the text from snake_case to Title Case', () => {
    expect(Text.case('hello_world', 'snake_case', 'Title Case')).toBe('Hello World');
  });

  it('should convert the text from kebab-case to camelCase', () => {
    expect(Text.case('hello-world', 'kebab-case', 'camelCase')).toBe('helloWorld');
  });

  it('should convert the text from kebab-case to snake_case', () => {
    expect(Text.case('hello-world', 'kebab-case', 'snake_case')).toBe('hello_world');
  });

  it('should convert the text from kebab-case to PascalCase', () => {
    expect(Text.case('hello-world', 'kebab-case', 'PascalCase')).toBe('HelloWorld');
  });

  it('should convert the text from kebab-case to CONSTANT_CASE', () => {
    expect(Text.case('hello-world', 'kebab-case', 'CONSTANT_CASE')).toBe('HELLO_WORLD');
  });

  it('should convert the text from kebab-case to Title Case', () => {
    expect(Text.case('hello-world', 'kebab-case', 'Title Case')).toBe('Hello World');
  });

  it('should convert the text from PascalCase to camelCase', () => {
    expect(Text.case('HelloWorld', 'PascalCase', 'camelCase')).toBe('helloWorld');
  });

  it('should convert the text from PascalCase to snake_case', () => {
    expect(Text.case('HelloWorld', 'PascalCase', 'snake_case')).toBe('hello_world');
  });

  it('should convert the text from PascalCase to kebab-case', () => {
    expect(Text.case('HelloWorld', 'PascalCase', 'kebab-case')).toBe('hello-world');
  });

  it('should convert the text from PascalCase to CONSTANT_CASE', () => {
    expect(Text.case('HelloWorld', 'PascalCase', 'CONSTANT_CASE')).toBe('HELLO_WORLD');
  });

  it('should convert the text from PascalCase to Title Case', () => {
    expect(Text.case('HelloWorld', 'PascalCase', 'Title Case')).toBe('Hello World');
  });

  it('should convert the text from CONSTANT_CASE to camelCase', () => {
    expect(Text.case('HELLO_WORLD', 'CONSTANT_CASE', 'camelCase')).toBe('helloWorld');
  });

  it('should convert the text from CONSTANT_CASE to snake_case', () => {
    expect(Text.case('HELLO_WORLD', 'CONSTANT_CASE', 'snake_case')).toBe('hello_world');
  });

  it('should convert the text from CONSTANT_CASE to kebab-case', () => {
    expect(Text.case('HELLO_WORLD', 'CONSTANT_CASE', 'kebab-case')).toBe('hello-world');
  });

  it('should convert the text from CONSTANT_CASE to PascalCase', () => {
    expect(Text.case('HELLO_WORLD', 'CONSTANT_CASE', 'PascalCase')).toBe('HelloWorld');
  });

  it('should convert the text from CONSTANT_CASE to Title Case', () => {
    expect(Text.case('HELLO_WORLD', 'CONSTANT_CASE', 'Title Case')).toBe('Hello World');
  });

  it('should convert the text from Title Case to camelCase', () => {
    expect(Text.case('Hello World', 'Title Case', 'camelCase')).toBe('helloWorld');
  });

  it('should convert the text from Title Case to snake_case', () => {
    expect(Text.case('Hello World', 'Title Case', 'snake_case')).toBe('hello_world');
  });

  it('should convert the text from Title Case to kebab-case', () => {
    expect(Text.case('Hello World', 'Title Case', 'kebab-case')).toBe('hello-world');
  });

  it('should convert the text from Title Case to PascalCase', () => {
    expect(Text.case('Hello World', 'Title Case', 'PascalCase')).toBe('HelloWorld');
  });

  it('should convert the text from Title Case to CONSTANT_CASE', () => {
    expect(Text.case('Hello World', 'Title Case', 'CONSTANT_CASE')).toBe('HELLO_WORLD');
  });
});
