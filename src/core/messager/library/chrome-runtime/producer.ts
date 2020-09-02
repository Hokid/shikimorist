import {Producer} from '../../producer';
import {Message} from '../../message';
import {InternalResponse} from './internal-response';
import {InternalMessage} from './internal-message';

export class ChromeRuntimeMessageProducer extends Producer {
    send(message: Message, waitAnswer: false): void;
    send<A extends any = void>(message: Message, waitAnswer: true): Promise<A>;
    send<A extends any = void>(message: Message, waitAnswer: boolean): Promise<A> | void;
    send<A extends any = void>(message: Message, waitAnswer: boolean): Promise<A> | void {
        const internalMessage: InternalMessage = {
            name: message.name,
            data: message.data,
            channel: this.channel
        };

        if (waitAnswer) {
            return new Promise((resolve, reject) => {
                window.chrome.runtime.sendMessage(internalMessage, (response: InternalResponse) => {
                    if (response.isError) {
                        reject(response.error);
                    } else {
                        resolve(response.data);
                    }
                });
            });
        }

        window.chrome.runtime.sendMessage(internalMessage);
    }
}
