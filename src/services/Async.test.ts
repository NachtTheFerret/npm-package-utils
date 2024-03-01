import { Async } from './Async';

describe('Async.each', () => {
  it('should execute a callback for each item in an array', async () => {
    const array = [1, 2, 3];
    let result = 0;

    await Async.each(array, async (item) => {
      result += item;
    });

    expect(result).toBe(6);
  });

  it('should execute a callback for each item in an array in order', async () => {
    const array = [1, 2, 3];
    const result: number[] = [];

    await Async.each(array, async (item) => {
      result.push(item);
    });

    expect(result).toEqual(array);
  });
});

describe('Async.parallel', () => {
  it('should execute a callback for each item in an array in parallel', async () => {
    const array = [1, 2, 3];
    let result = 0;

    await Async.parallel(array, async (item) => {
      result += item;
    });

    expect(result).toBe(6);
  });
});

describe('Async.sleep', () => {
  it('should wait for a specific amount of time', async () => {
    const start = Date.now();
    await Async.sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});

describe('Async.map', () => {
  it('should map an array', async () => {
    const array = [1, 2, 3];
    const result = await Async.map(array, async (item) => item * 2);
    expect(result).toEqual([2, 4, 6]);
  });
});

describe('Async.filter', () => {
  it('should filter an array', async () => {
    const array = [1, 2, 3];
    const result = await Async.filter(array, async (item) => item > 1);
    expect(result).toEqual([2, 3]);
  });
});

describe('Async.reduce', () => {
  it('should reduce an array', async () => {
    const array = [1, 2, 3];
    const result = await Async.reduce(array, async (accumulator, item) => accumulator + item, 0);
    expect(result).toBe(6);
  });
});

describe('Async.some', () => {
  it('should return true if at least one item in the array passes the test', async () => {
    const array = [1, 2, 3];
    const result = await Async.some(array, async (item) => item > 2);
    expect(result).toBe(true);
  });

  it('should return false if no item in the array passes the test', async () => {
    const array = [1, 2, 3];
    const result = await Async.some(array, async (item) => item > 3);
    expect(result).toBe(false);
  });
});

describe('Async.every', () => {
  it('should return true if all items in the array pass the test', async () => {
    const array = [1, 2, 3];
    const result = await Async.every(array, async (item) => item > 0);
    expect(result).toBe(true);
  });

  it('should return false if at least one item in the array does not pass the test', async () => {
    const array = [1, 2, 3];
    const result = await Async.every(array, async (item) => item > 1);
    expect(result).toBe(false);
  });
});

describe('Async.find', () => {
  it('should find an item in the array', async () => {
    const array = [1, 2, 3];
    const result = await Async.find(array, async (item) => item === 2);
    expect(result).toBe(2);
  });

  it('should return undefined if the item is not found in the array', async () => {
    const array = [1, 2, 3];
    const result = await Async.find(array, async (item) => item === 4);
    expect(result).toBeUndefined();
  });
});

describe('Async.findIndex', () => {
  it('should find the index of an item in the array', async () => {
    const array = [1, 2, 3];
    const result = await Async.findIndex(array, async (item) => item === 2);
    expect(result).toBe(1);
  });

  it('should return -1 if the item is not found in the array', async () => {
    const array = [1, 2, 3];
    const result = await Async.findIndex(array, async (item) => item === 4);
    expect(result).toBe(-1);
  });
});
