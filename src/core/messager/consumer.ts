import {Message} from './message';

export type Handler<Data extends any = any> = (resolve?: (data: Data) => void, reject?: (error: any) => void) => boolean|void;

export abstract class Consumer {
    protected constructor(public channel: string) {
    }

    abstract on<Data extends any = any>(message: Message<Data>, handler: Handler<Data>): void;

    abstract off<Data extends any = any>(message: Message<Data>, handler: Handler<Data>): void;
}
