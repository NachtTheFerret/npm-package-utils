export type TextCase = 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase' | 'CONSTANT_CASE' | 'Title Case';
export type TextRandomType = (keyof typeof chars)[] | 'hex' | 'base64';

const chars = {
  letter: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  special: '!@#$%^&*()_+{}:"<>?|[]\\;\',./`~',
};

export class Text {
  /**
   * Replace variables in the text with the values from the object
   * @param text The text to replace the variables in
   * @param variables The object with the variables to replace
   * @returns The text with the variables replaced
   */
  static var(text: string, variables?: Record<string, any>) {
    if (!variables) return text;

    return text.replace(/{([^}]+)}/g, (match, key) => {
      if (!variables) return match;

      const value = key.split('.').reduce((acc: any, k: string) => acc[k], variables);
      if (value === undefined) return match;
      return value;
    });
  }

  /**
   * Add capital letters for each word in the text
   * @param text The text to capitalize
   * @returns The capitalized text
   */
  static capitalize(text: string, eachWord = false): string {
    if (eachWord) {
      const words = text.split(' ');
      return words.map((word) => Text.capitalize(word.toLowerCase())).join(' ');
    } else return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Convert the text from one case to another
   * @param text The text to convert
   * @param from The current case of the text
   * @param to The case to convert the text to
   * @returns The converted text
   */
  static case(text: string, from: TextCase, to: TextCase) {
    const txt = text.trim();
    if (from === to) return txt;

    if (from === 'camelCase') {
      if (to === 'snake_case') return txt.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
      if (to === 'kebab-case') return txt.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      if (to === 'PascalCase') return txt.charAt(0).toUpperCase() + txt.slice(1);
      if (to === 'CONSTANT_CASE') return txt.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase();
      if (to === 'Title Case') {
        const result = txt.replace(/([a-z])([A-Z])/g, '$1 $2');
        return Text.capitalize(result.charAt(0).toLowerCase() + result.slice(1));
      }
    } else if (from === 'snake_case') {
      const words = txt.split('_');
      if (to === 'camelCase') return txt.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
      if (to === 'kebab-case') return txt.replace(/_/g, '-');
      if (to === 'PascalCase') return Text.capitalize(words.join(' '), true).replace(/ /g, '');
      if (to === 'CONSTANT_CASE') return txt.toUpperCase();
      if (to === 'Title Case') return Text.capitalize(words.join(' '), true);
    } else if (from === 'kebab-case') {
      const words = txt.split('-');
      if (to === 'camelCase') return txt.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
      if (to === 'snake_case') return txt.replace(/-/g, '_');
      if (to === 'PascalCase') return Text.capitalize(words.join(' '), true).replace(/ /g, '');
      if (to === 'CONSTANT_CASE') return txt.replace(/-/g, '_').toUpperCase();
      if (to === 'Title Case') return Text.capitalize(words.join(' '), true);
    } else if (from === 'PascalCase') {
      if (to === 'camelCase') return txt.charAt(0).toLowerCase() + txt.slice(1);
      if (to === 'snake_case') return txt.replace(/(?!^[A-Z])[A-Z]/g, (match) => `_${match}`).toLowerCase();
      if (to === 'kebab-case') return txt.replace(/(?!^[A-Z])[A-Z]/g, (match) => `-${match}`).toLowerCase();
      if (to === 'CONSTANT_CASE') return txt.replace(/(?!^[A-Z])[A-Z]/g, (match) => `_${match}`).toUpperCase();
      if (to === 'Title Case') return txt.replace(/([A-Z])/g, ' $1').trim();
    } else if (from === 'CONSTANT_CASE') {
      const words = txt.toLowerCase().split('_');
      if (to === 'camelCase') return txt.toLowerCase().replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
      if (to === 'snake_case') return txt.toLowerCase();
      if (to === 'kebab-case') return txt.toLowerCase().replace(/_/g, '-');
      if (to === 'PascalCase') return Text.capitalize(words.join(' '), true).replace(/ /g, '');
      if (to === 'Title Case') return Text.capitalize(words.join(' '), true);
    } else if (from === 'Title Case') {
      if (to === 'camelCase') {
        const result = txt.replace(/ /g, '').replace(/([a-z])([A-Z])/g, '$1$2');
        return result.charAt(0).toLowerCase() + result.slice(1);
      }
      if (to === 'snake_case') return txt.replace(/ /g, '_').toLowerCase();
      if (to === 'kebab-case') return txt.replace(/ /g, '-').toLowerCase();
      if (to === 'PascalCase') return txt.replace(/ /g, '').replace(/([a-z])([A-Z])/g, '$1$2');
      if (to === 'CONSTANT_CASE') return txt.replace(/ /g, '_').toUpperCase();
    }

    return txt;
  }

  /**
   * Generate a random string with the specified length and type
   * @param length The length of the random string
   * @param type The type of the random string (hex, base64, letter, number, special)
   * @returns The random string
   */
  static random(length = 8, type: TextRandomType = 'base64') {
    if (type === 'hex') return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    if (type === 'base64') {
      const pool = chars.letter + chars.number + '+/';
      return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
    }

    const pool = type.reduce((acc, key) => acc + chars[key], '');
    return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
  }

  /**
   * Pluralize the text based on the count
   * @param text The text to pluralize
   * @param count The count to determine if the text should be pluralized
   * @returns The pluralized text
   */
  static pluralize(text: string, count: number) {
    return count === 1 ? text : text + 's';
  }

  /**
   * Remove the variables from the text
   * @param text The text to remove the variables from
   * @returns The text without the variables
   */
  static unvar(text: string) {
    return text.replace(/{([^}]+)}/g, '');
  }
}
