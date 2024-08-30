import { Async } from './Async';

type Result<R> = R | Promise<R>;

/**
 * A collection of key-value pairs, extending the built-in Map class.
 */
export class Collection<K, V> extends Map<K, V> {
  /**
   * Filters the collection based on a callback (asynchronously).
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.filter(async (value) => value % 2 === 0);
   * console.log(result); // Collection { 'b' => 2 }
   * @returns A new collection with the filtered values.
   */
  async filter(callback: (value: V, key: K) => Result<boolean>): Promise<Collection<K, V>> {
    const array = Array.from(this);

    const results = await Async.filter(array, async ([key, value]) => callback(value, key));

    return new Collection(results);
  }

  /**
   * Maps the collection based on a callback (asynchronously).
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.map(async (value) => value * 2);
   * console.log(result); // Collection { 'a' => 2, 'b' => 4, 'c' => 6 }
   * @returns A new collection with the mapped values.
   */
  async map<R>(callback: (value: V, key: K) => Result<R>): Promise<Collection<K, R>> {
    const array = Array.from(this);
    const results = new Collection<K, R>();

    await Async.each(array, async ([key, value]) => {
      results.set(key, await callback(value, key));
    });

    return results;
  }

  /**
   * Checks if any value in the collection passes a callback.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.some(async (value) => value % 2 === 0);
   * console.log(result); // true
   * @returns Whether any value passes the callback.
   */
  async some(callback: (value: V, key: K) => Result<boolean>): Promise<boolean> {
    const array = Array.from(this);

    return Async.some(array, async ([key, value]) => callback(value, key));
  }

  /**
   * Checks if every value in the collection passes a callback.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.every(async (value) => value > 0);
   * console.log(result); // true
   * @returns Whether every value passes the callback.
   */
  async every(callback: (value: V, key: K) => Result<boolean>): Promise<boolean> {
    const array = Array.from(this);

    return Async.every(array, async ([key, value]) => callback(value, key));
  }

  /**
   * Finds a value in the collection based on a callback.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.find(async (value) => value === 2);
   * console.log(result); // 2
   * @returns The value found, if any.
   */
  async find(callback: (value: V, key: K) => Result<boolean>): Promise<V | undefined> {
    const array = Array.from(this);

    const result = await Async.find(array, async ([key, value]) => callback(value, key));

    return result ? result[1] : undefined;
  }

  /**
   * Finds a key in the collection based on a callback.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.findKey(async (value) => value === 2);
   * console.log(result); // 'b'
   * @returns The key found, if any.
   */
  async reduce<R>(callback: (accumulator: R, value: V, key: K) => Result<R>, initialValue: R): Promise<R> {
    const array = Array.from(this);
    let accumulator = initialValue;

    await Async.each(array, async ([key, value]) => {
      accumulator = await callback(accumulator, value, key);
    });

    return accumulator;
  }

  /**
   * Checks if the collection includes a specific value.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.includes(async (value) => value === 2);
   * console.log(result); // true
   * @returns Whether the collection includes the value.
   */
  async each(callback: (value: V, key: K) => Result<void>): Promise<void> {
    const array = Array.from(this);

    await Async.each(array, async ([key, value]) => callback(value, key));
  }

  /**
   * Checks if the collection includes a specific value.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.includes(async (value) => value === 2);
   * console.log(result); // true
   * @returns Whether the collection includes the value.
   */
  async first(): Promise<V | undefined> {
    return this.values().next().value;
  }

  /**
   * Checks if the collection includes a specific value.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.includes(async (value) => value === 2);
   * console.log(result); // true
   * @returns Whether the collection includes the value.
   */
  async last(): Promise<V | undefined> {
    const array = Array.from(this.values());
    return array[array.length - 1];
  }

  /**
   * Checks if the collection includes a specific value.
   * @param callback
   * @example
   * const collection = new Collection([
   *   ['a', 1],
   *   ['b', 2],
   *   ['c', 3]
   * ]);
   * const result = await collection.includes(async (value) => value === 2);
   * console.log(result); // true
   * @returns Whether the collection includes the value.
   */
  async random(): Promise<V | undefined> {
    const array = Array.from(this.values());
    return array[Math.floor(Math.random() * array.length)];
  }
}
