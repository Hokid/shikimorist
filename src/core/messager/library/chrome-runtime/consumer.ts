import {Consumer, Handler} from '../../consumer';
import {InternalMessage} from './internal-message';
import {Message} from '../../message';

type InternalHandler = (message: InternalMessage, _: any, response: (response?: any) => void) => boolean|void;

export class ChromeRuntimeMessageConsumer extends Consumer {
    private handlersCount: number = 0;
    private handlers: Map<string, Handler[]> = new Map<string, Handler[]>();
    private readonly internalHandler: InternalHandler;

    constructor(public channel: string) {
        super(channel);
        this.internalHandler = (internalMessage: InternalMessage, _: any, response: (response?: any) => void) => {
            if (internalMessage.channel !== this.channel) {
                return;
            }

            const handlers = this.handlers.get(internalMessage.name);

            let topWaitAnswer: boolean = false;

            if (handlers) {
                for (const handler of handlers) {
                    const waitAnswer = handler(
                        _ => response({isError: false, data: _}),
                        _ => response({isError: true, error: _}),
                    );
                    if (waitAnswer && !topWaitAnswer) {
                        topWaitAnswer = waitAnswer;
                    }
                }
            }

            return topWaitAnswer;
        };
    }

    on<Data extends any = any>(message: Message<Data>, handler: Handler<Data>): void {
        this.addHandler(message.constructor.messageName, handler);
    }

    off<Data extends any = any>(message: Message<Data>, handler: Handler<Data>): void {
        this.removeHandler(message, handler);
    }

    private addHandler(message: string, handler: Handler): void {
        const handlers = this.handlers.get(message) || [];
        this.handlers.set(message, handlers);
        handlers.push(handler);
        this.handlersCount++;
        if (this.handlersCount === 1) {
            window.chrome.runtime.onMessage.addListener(this.internalHandler);
        }
    }

    private removeHandler(message: string, handler: Handler): void {
        if (this.handlersCount === 0) {
            return;
        }
        let handlers = this.handlers.get(message);
        if (!handlers) {
            return;
        }
        handlers = handlers.filter(_ => {
            if (_ === handler) {
                this.handlersCount--;
                return false;
            }
            return true;
        });
        if (handlers.length > 0) {
            this.handlers.set(message, handlers);
        } else {
            this.handlers.delete(message);
        }
        if (this.handlersCount === 0) {
            window.chrome.runtime.onMessage.removeListener(this.internalHandler);
        }
    }
}
