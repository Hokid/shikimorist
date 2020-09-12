import {Bus, Handler} from '../../bus';
import {ChanelMessage} from './chanel-message';
import {MemoryBus} from '../memory/memory-bus';
import {ChanelResponse} from './chanel-response';

type OnMessageHandler = (message: ChanelMessage, _: any, response: (response?: any) => void) => boolean | void;

export type Options = {
    sendMethod?: 'currentTab' | 'runtime'
}

export class ChromeRuntimeBus extends Bus {
    private handlersCount: number = 0;
    private memoryBus: Bus = new MemoryBus();
    private readonly onMessageHandler: OnMessageHandler;

    constructor(private options: Options = {sendMethod: 'runtime'}) {
        super();
        this.onMessageHandler = (chanelMessage, _, response) => {
            const result = this.memoryBus.send(
                chanelMessage.chanel,
                chanelMessage.name,
                chanelMessage.data,
                chanelMessage.waitAnswer
            );

            if (chanelMessage.waitAnswer) {
                (result as Promise<any>)
                    .then(_ => response(new ChanelResponse(false, _)))
                    .catch(_ => response(new ChanelResponse(true, undefined, _.toString())));
                return chanelMessage.waitAnswer;
            }
        };
    }

    off(chanel: string, name: string, handler: Handler): boolean {
        const done = this.memoryBus.off(chanel, name, handler);
        if (done) {
            this.handlersCount--;
        }
        if (this.handlersCount === 0) {
            window.chrome.runtime.onMessage.removeListener(this.onMessageHandler);
        }
        return done;
    }

    on(chanel: string, name: string, handler: Handler): void {
        this.memoryBus.on(chanel, name, handler);
        this.handlersCount++;
        if (this.handlersCount === 1) {
            window.chrome.runtime.onMessage.addListener(this.onMessageHandler);
        }
    }

    send(chanel: string, name: string, data: any, waitResponse: boolean): Promise<any> {
        const message = new ChanelMessage(
            name,
            data,
            chanel,
            waitResponse
        );

        if (this.options.sendMethod === 'runtime') {
            return this.sendFromRuntime(message);
        } else if (this.options.sendMethod === 'currentTab') {
            return this.sendFromCurrentTab(message);
        }

        return Promise.reject(new Error('[Chrome runtime bus]: Unsupported send method'));
    }

    private sendFromRuntime(chanelMessage: ChanelMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            if (chanelMessage.waitAnswer) {
                window.chrome.runtime.sendMessage(chanelMessage, (response: ChanelResponse) => {
                    if (response.isFail) {
                        reject(response.error);
                    } else {
                        resolve(response.data);
                    }
                });
                return;
            }

            window.chrome.runtime.sendMessage(chanelMessage);
            resolve();
        });
    }

    private sendFromCurrentTab(chanelMessage: ChanelMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (chanelMessage.waitAnswer) {
                    window.chrome.tabs.sendMessage(tabs[0].id!, chanelMessage, (response: ChanelResponse) => {
                        if (response.isFail) {
                            reject(response.error);
                        } else {
                            resolve(response.data);
                        }
                    });
                    return;
                }

                window.chrome.tabs.sendMessage(tabs[0].id!, chanelMessage);
                resolve();
            });
        });
    }
}
