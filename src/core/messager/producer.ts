import {Message} from './message';

export interface ChanelMessageProducer {
    send<M extends Message = Message>(message: M): Promise<void>;

    send<M extends Message = Message>(message: M, waitResponse: false): Promise<void>;

    send<M extends Message = Message>(message: M, waitResponse: true): Promise<M extends Message<infer A, infer B, infer R> ? R : unknown>;

    send<M extends Message = Message>(message: M, waitResponse: boolean): Promise<any>;
}
