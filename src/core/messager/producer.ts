import {Message} from './message';
import {Bus} from './bus';

export class Producer {
    constructor(
        public channel: string,
        private bus: Bus
    ) {
    }

    send<M extends Message = Message>(message: M): Promise<void>;
    send<M extends Message = Message>(message: M, waitResponse: false): Promise<void>;
    send<M extends Message = Message>(message: M, waitResponse: true): Promise<M extends Message<infer A, infer B, infer R> ? R : unknown>;
    async send<M extends Message = Message>(message: M, waitResponse: boolean = false): Promise<any> {
        message.response = await this.bus.send(this.channel, message.name, message.data, waitResponse);
        return message.response;
    }
}
