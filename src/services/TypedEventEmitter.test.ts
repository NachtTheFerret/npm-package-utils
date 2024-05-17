import { TypedEventEmitter } from './TypedEventEmitter';

describe('TypedEventEmitter', () => {
  it('should work', () => {
    const emitter = new TypedEventEmitter<{
      foo: [string, number];
      bar: [boolean];
    }>();

    const fooListener = jest.fn();
    const barListener = jest.fn();

    emitter.on('foo', fooListener);
    emitter.on('bar', barListener);

    emitter.emit('foo', 'hello', 123);
    emitter.emit('bar', true);

    expect(fooListener).toHaveBeenCalledWith('hello', 123);
    expect(barListener).toHaveBeenCalledWith(true);
  });
});
