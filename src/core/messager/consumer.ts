import {Message} from './message';
import {Bus, Handler} from './bus';


export class Consumer {
    constructor(
        public channel: string,
        private bus: Bus
    ) {
    }

    on<M extends Message = Message>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<infer N, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): void;

    on(name: string, handler: Handler): void {
        this.bus.on(this.channel, name, handler);
    }

    off<M extends Message = Message>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): boolean;

    off(name: string, handler: Handler): boolean {
        return this.bus.off(this.channel, name, handler);
    }
}
