import {Bus, Handler} from './bus';
import {Message} from './message';
import {ChanelMessageProducer} from './producer';
import {ChanelMessageConsumer} from './consumer';

export class Chanel implements ChanelMessageProducer, ChanelMessageConsumer {
    constructor(
        public chanel: string,
        private bus: Bus
    ) {
    }

    on<M extends Message = Message>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<any, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): void;

    on(name: string, handler: Handler): void {
        this.bus.on(this.chanel, name, handler);
    }

    off<M extends Message = Message>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<any, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): boolean;

    off(name: string, handler: Handler): boolean {
        return this.bus.off(this.chanel, name, handler);
    }

    send<M extends Message = Message>(message: M): Promise<void>;
    send<M extends Message = Message>(message: M, waitResponse: false): Promise<void>;
    send<M extends Message = Message>(message: M, waitResponse: true): Promise<M extends Message<infer A, infer B, infer R> ? R : unknown>;
    async send<M extends Message = Message>(message: M, waitResponse: boolean = false): Promise<any> {
        message.response = await this.bus.send(this.chanel, message.name, message.data, waitResponse);
        return message.response;
    }
}
