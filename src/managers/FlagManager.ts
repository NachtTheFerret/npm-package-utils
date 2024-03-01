/**
 * Manages flags using bitwise operations.
 */
export class FlagManager<T extends Record<string, bigint>> {
  /**
   * @param flags
   * @example
   * ```ts
   * const flags = {
   *  EN: 1n << 0n,
   *  FR: 1n << 1n,
   *  DE: 1n << 2n,
   *  ES: 1n << 3n,
   *  IT: 1n << 4n,
   * };
   *
   * const flagManager = new FlagManager(flags);
   */
  constructor(public flags: T) {}

  /**
   * Checks if the current flags contain the needed flags.
   * @param current
   * @param needed
   * @returns
   * @example
   * ```ts
   * const current = flagManager.merge(['EN', 'FR']);
   * const needed = flagManager.merge(['EN']);
   * flagManager.has(current, needed); // true
   * ```
   */
  public has(current: bigint | keyof T | (keyof T)[], needed: bigint | keyof T | (keyof T)[]) {
    const currentBit = typeof current === 'bigint' ? current : this.merge(current);
    const neededBit = typeof needed === 'bigint' ? needed : this.merge(needed);

    return (currentBit & neededBit) === neededBit;
  }

  /**
   * Resolves the flags from a bit.
   * @param bit
   * @returns
   * @example
   * ```ts
   * const bit = flagManager.merge(['EN', 'FR']);
   * flagManager.resolve(bit); // ['EN', 'FR']
   * ```
   */
  public resolve(bit: bigint): (keyof T)[] {
    const { flags } = this;

    const result = Object.entries(flags).filter((tag) => (bit & flags[tag[0]]) === tag[1]);
    return result.map(([key]) => key);
  }

  /**
   * Returns the difference between the current and needed flags.
   * @param current
   * @param needed
   * @returns
   * @example
   * ```ts
   * const current = flagManager.merge(['EN', 'FR']);
   * const needed = flagManager.merge(['EN']);
   * flagManager.difference(current, needed); // 2n
   * ```
   */
  public difference(current: bigint | keyof T | (keyof T)[], needed: bigint | keyof T | (keyof T)[]) {
    const currentBit = typeof current === 'bigint' ? current : this.merge(current);
    const neededBit = typeof needed === 'bigint' ? needed : this.merge(needed);

    return currentBit ^ neededBit;
  }

  /**
   * Adds the needed flags to the current flags.
   * @param current
   * @param needed
   * @returns
   * @example
   * ```ts
   * const current = flagManager.merge(['EN', 'FR']);
   * const needed = flagManager.merge(['EN']);
   * flagManager.add(current, needed); // 3n
   * ```
   */
  public add(current: bigint | keyof T | (keyof T)[], needed: bigint | keyof T | (keyof T)[]) {
    const currentBit = typeof current === 'bigint' ? current : this.merge(current);
    const neededBit = typeof needed === 'bigint' ? needed : this.merge(needed);

    return currentBit | neededBit;
  }

  /**
   * Removes the needed flags from the current flags.
   * @param current
   * @param needed
   * @returns
   * @example
   * ```ts
   * const current = flagManager.merge(['EN', 'FR']);
   * const needed = flagManager.merge(['EN']);
   * flagManager.remove(current, needed); // 2n
   * ```
   */
  public remove(current: bigint | keyof T | (keyof T)[], needed: bigint | keyof T | (keyof T)[]) {
    const currentBit = typeof current === 'bigint' ? current : this.merge(current);
    const neededBit = typeof needed === 'bigint' ? needed : this.merge(needed);

    return currentBit ^ neededBit;
  }

  /**
   * Merges the flags into a single bit.
   * @param keys
   * @returns
   * @example
   * ```ts
   * flagManager.merge(['EN', 'FR']); // 3n
   * ```
   */
  public merge(keys: keyof T | (keyof T)[]) {
    const { flags } = this;

    if (Array.isArray(keys)) return keys.reduce((acc, key) => acc | flags[key], 0n);
    return flags[keys];
  }
}
