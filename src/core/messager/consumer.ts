import {Message} from './message';
import {Bus, Handler} from './bus';


export interface ChanelMessageConsumer {
    on<M extends Message = Message>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<any, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): void;

    on(name: string, handler: Handler): void;

    off<M extends Message = Message>(
        name: M extends Message<infer N> ? N : string,
        handler: M extends Message<any, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): boolean;

    off(name: string, handler: Handler): boolean;
}
