import { Collection } from './Collection';

describe('Collection.filter', () => {
  it('should filter the collection based on a callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.filter(async (value) => value % 2 === 0);
    expect(result).toEqual(new Collection([['b', 2]]));
  });
});

describe('Collection.map', () => {
  it('should map the collection based on a callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.map(async (value) => value * 2);
    expect(result).toEqual(
      new Collection([
        ['a', 2],
        ['b', 4],
        ['c', 6],
      ])
    );
  });
});

describe('Collection.some', () => {
  it('should return true if any value passes the callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.some(async (value) => value % 2 === 0);
    expect(result).toBe(true);
  });

  it('should return false if no value passes the callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.some(async (value) => value > 3);
    expect(result).toBe(false);
  });
});

describe('Collection.every', () => {
  it('should return true if all values pass the callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.every(async (value) => value > 0);
    expect(result).toBe(true);
  });

  it('should return false if any value fails the callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.every(async (value) => value > 1);
    expect(result).toBe(false);
  });
});

describe('Collection.find', () => {
  it('should find the first value that passes the callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.find(async (value) => value === 2);
    expect(result).toBe(2);
  });

  it('should return undefined if no value passes the callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.find(async (value) => value === 4);
    expect(result).toBeUndefined();
  });
});

describe('Collection.reduce', () => {
  it('should reduce the collection based on a callback', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.reduce(async (acc, value) => acc + value, 0);
    expect(result).toBe(6);
  });
});

describe('Collection.each', () => {
  it('should iterate over each item in the collection', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const spy = jest.fn();
    await collection.each(spy);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(1, 'a');
    expect(spy).toHaveBeenCalledWith(2, 'b');
    expect(spy).toHaveBeenCalledWith(3, 'c');
  });
});

describe('Collection.first', () => {
  it('should return the first item in the collection', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.first();
    expect(result).toBe(1);
  });

  it('should return undefined if the collection is empty', async () => {
    const collection = new Collection();
    const result = await collection.first();
    expect(result).toBeUndefined();
  });
});

describe('Collection.last', () => {
  it('should return the last item in the collection', async () => {
    const collection = new Collection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = await collection.last();
    expect(result).toBe(3);
  });

  it('should return undefined if the collection is empty', async () => {
    const collection = new Collection();
    const result = await collection.last();
    expect(result).toBeUndefined();
  });
});
