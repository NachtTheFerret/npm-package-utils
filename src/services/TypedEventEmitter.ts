import { EventEmitter } from 'stream';

export type TypedEventEmitterEvents = Record<string, unknown[]>;

export class TypedEventEmitter<Events extends TypedEventEmitterEvents> {
  public readonly emitter = new EventEmitter();

  public on<Event extends keyof Events>(event: Event, listener: (...args: Events[Event]) => void) {
    this.emitter.on(event as string, listener);
    return this;
  }

  public once<Event extends keyof Events>(event: Event, listener: (...args: Events[Event]) => void) {
    this.emitter.once(event as string, listener);
    return this;
  }

  public off<Event extends keyof Events>(event: Event, listener: (...args: Events[Event]) => void) {
    this.emitter.off(event as string, listener);
    return this;
  }

  public emit<Event extends keyof Events>(event: Event, ...args: Events[Event]) {
    this.emitter.emit(event as string, ...args);
    return this;
  }

  public removeAllListeners(event?: keyof Events) {
    this.emitter.removeAllListeners(event as string);
    return this;
  }

  public listenerCount(event: keyof Events) {
    return this.emitter.listenerCount(event as string);
  }

  public listeners(event: keyof Events) {
    return this.emitter.listeners(event as string);
  }
}
