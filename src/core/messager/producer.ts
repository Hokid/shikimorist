import {Message} from './message';

export abstract class Producer {
    protected constructor(public channel: string) {
    }

    abstract send(message: Message, waitAnswer: false): void;
    abstract send<A extends any = void>(message: Message, waitAnswer: true): Promise<A>;
    abstract send<A extends any = void>(message: Message, waitAnswer: boolean): Promise<A> | void;
}
