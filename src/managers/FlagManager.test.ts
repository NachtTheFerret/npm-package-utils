import { FlagManager } from './FlagManager';

const flags = {
  EN: 1n << 0n,
  FR: 1n << 1n,
  DE: 1n << 2n,
  ES: 1n << 3n,
  IT: 1n << 4n,
};

const flagManager = new FlagManager(flags);

describe('FlagManager.has', () => {
  it('should return true if the current flag has the needed flag', () => {
    const current = flagManager.merge(['EN', 'FR']);
    const needed = flagManager.merge('EN');
    expect(flagManager.has(current, needed)).toBe(true);
  });

  it('should return false if the current flag does not have the needed flag', () => {
    const current = flagManager.merge('EN');
    const needed = flagManager.merge('FR');
    expect(flagManager.has(current, needed)).toBe(false);
  });
});

describe('FlagManager.resolve', () => {
  it('should resolve the flags from a bit', () => {
    const bit = flagManager.merge(['EN', 'FR']);
    const result = flagManager.resolve(bit);
    expect(result).toEqual(['EN', 'FR']);
  });
});

describe('FlagManager.difference', () => {
  it('should return the difference between the current flag and the needed flag', () => {
    const current = flagManager.merge(['EN', 'FR', 'DE', 'EN']);
    const needed = flagManager.merge('EN');
    const result = flagManager.difference(current, needed);

    expect(flagManager.resolve(result)).toEqual(['FR', 'DE']);
  });
});

describe('FlagManager.add', () => {
  it('should add a flag to the current flag', () => {
    const current = flagManager.merge('EN');
    const needed = flagManager.merge('FR');
    const result = flagManager.add(current, needed);

    expect(flagManager.resolve(result)).toEqual(['EN', 'FR']);
  });
});

describe('FlagManager.remove', () => {
  it('should remove a flag from the current flag', () => {
    const current = flagManager.merge(['EN', 'FR']);
    const needed = flagManager.merge('EN');
    const result = flagManager.remove(current, needed);

    expect(flagManager.resolve(result)).toEqual(['FR']);
  });
});

describe('FlagManager.merge', () => {
  it('should merge the flags into a bit', () => {
    const result = flagManager.merge(['EN', 'FR']);
    expect(result).toBe(flagManager.flags.EN | flagManager.flags.FR);
  });
});
