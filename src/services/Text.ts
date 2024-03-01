export type TextCase = 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase' | 'CONSTANT_CASE' | 'Title Case';

export class Text {
  static var(text: string, variables?: Record<string, any>) {
    if (!variables) return text;

    return text.replace(/{([^}]+)}/g, (match, key) => {
      if (!variables) return match;

      const value = key.split('.').reduce((acc: any, k: string) => acc[k], variables);
      if (value === undefined) return match;
      return value;
    });
  }

  static capitalize(text: string, eachWord = false): string {
    if (eachWord) {
      const words = text.split(' ');
      return words.map((word) => Text.capitalize(word.toLowerCase())).join(' ');
    } else return text.charAt(0).toUpperCase() + text.slice(1);
  }

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
}
