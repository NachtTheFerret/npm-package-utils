/**
 * A collection of async functions that can be used to work with arrays and promises.
 */
export class Async {
  /**
   * Iterates over an array and calls a callback for each item.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * let result = 0;
   *
   * await Async.each(array, async (item) => {
   *  result += item;
   * });
   *
   * console.log(result); // 6
   * ```
   */
  static async each<T>(array: T[], callback: (item: T, index: number, array: T[]) => void | Promise<void>) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  /**
   * Iterates over an array and calls a callback for each item in parallel.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * let result = 0;
   *
   * await Async.parallel(array, async (item) => {
   *  result += item;
   * });
   *
   * console.log(result); // 6
   * ```
   */
  static async parallel<T>(array: T[], callback: (item: T, index: number, array: T[]) => void | Promise<void>) {
    await Async.map(array, callback);
  }

  /**
   * Waits for a specific amount of time.
   * @param ms
   * @example
   * ```typescript
   * const start = Date.now();
   * await Async.sleep(100);
   * const end = Date.now();
   * console.log(end - start); // 100
   * ```
   */
  static async sleep(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Maps an array.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.map(array, async (item) => item * 2);
   * console.log(result); // [2, 4, 6]
   * ```
   */
  static async map<T, U>(array: T[], callback: (item: T, index: number, array: T[]) => U) {
    const promises = array.map(async (item, index) => callback(item, index, array));
    return Promise.all(promises);
  }

  /**
   * Filters an array.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.filter(array, async (item) => item > 1);
   * console.log(result); // [2, 3]
   * ```
   */
  static async filter<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean | Promise<boolean>) {
    const result: T[] = [];

    for (let index = 0; index < array.length; index++) {
      if (await callback(array[index], index, array)) result.push(array[index]);
    }

    return result;
  }

  /**
   * Reduces an array.
   * @param array
   * @param callback
   * @param initialValue
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.reduce(array, async (accumulator, item) => accumulator + item, 0);
   * console.log(result); // 6
   * ```
   */
  static async reduce<T, U>(
    array: T[],
    callback: (accumulator: U, item: T, index: number, array: T[]) => U | Promise<U>,
    initialValue: U
  ) {
    let accumulator = initialValue;

    for (let index = 0; index < array.length; index++) {
      accumulator = await callback(accumulator, array[index], index, array);
    }

    return accumulator;
  }

  /**
   * Checks if an array includes a specific item.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.includes(array, async (item) => item === 2);
   * console.log(result); // true
   * ```
   */
  static async some<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean | Promise<boolean>) {
    for (let index = 0; index < array.length; index++) {
      if (await callback(array[index], index, array)) return true;
    }

    return false;
  }

  /**
   * Checks if all items in an array pass a test.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.every(array, async (item) => item > 1);
   * console.log(result); // false
   * ```
   */
  static async every<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean | Promise<boolean>) {
    for (let index = 0; index < array.length; index++) {
      if (!(await callback(array[index], index, array))) return false;
    }

    return true;
  }

  /**
   * Finds an item in an array.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.find(array, async (item) => item === 2);
   * console.log(result); // 2
   * ```
   */
  static async find<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean | Promise<boolean>) {
    for (let index = 0; index < array.length; index++) {
      if (await callback(array[index], index, array)) return array[index];
    }

    return undefined;
  }

  /**
   * Finds the index of an item in an array.
   * @param array
   * @param callback
   * @example
   * ```typescript
   * const array = [1, 2, 3];
   * const result = await Async.findIndex(array, async (item) => item === 2);
   * console.log(result); // 1
   * ```
   */
  static async findIndex<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean | Promise<boolean>) {
    for (let index = 0; index < array.length; index++) {
      if (await callback(array[index], index, array)) return index;
    }

    return -1;
  }
}
