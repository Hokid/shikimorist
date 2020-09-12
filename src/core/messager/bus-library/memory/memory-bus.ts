import {Bus, Handler} from '../../bus';

export class MemoryBus extends Bus {
    private channels: Map<string, Map<string, Handler[]>> = new Map();

    on(chanel: string, name: string, handler: Handler) {
        const chanelEntry = this.channels.get(chanel) || new Map();
        const handlers = chanelEntry.get(name) || [];

        handlers.push(handler);
        chanelEntry.set(name, handlers);
        this.channels.set(chanel, chanelEntry);
    }

    off(chanel: string, name: string, handler: Handler) {
        const chanelEntry = this.channels.get(chanel);
        if (chanelEntry) {
            const handlers = chanelEntry.get(name);
            if (handlers) {
                const nextHandlers = handlers.filter(_ => _ !== handler);
                chanelEntry.set(name, nextHandlers);
                return nextHandlers.length !== handlers.length;
            }
        }
        return false;
    }

    send(chanel: string, name: string, data: any, waitResponse: boolean): Promise<any> {
        const chanelEntry = this.channels.get(chanel);
        const dataStr = data !== undefined ? JSON.stringify(data) : '';

        if (chanelEntry) {
            const handlers = chanelEntry.get(name);

            if (handlers && handlers.length !== 0) {
                const handlersCopy = handlers.slice();
                return Promise.resolve().then(
                    () => {
                        for (const handler of handlersCopy) {
                            let result: any;

                            let resolve = (_: any) => {
                                result = Promise.resolve(_);
                            };

                            let reject = (_: any) => {
                                result = Promise.reject(_);
                            };

                            const willProduceResponse = handler(
                                dataStr ? JSON.parse(dataStr) : undefined,
                                (_: any) => {
                                    resolve(_);
                                },
                                (_: any) => {
                                    reject(_);
                                }
                            );

                            if (waitResponse && willProduceResponse) {
                                if (result) {
                                    return result;
                                }

                                return new Promise((_resolve, _reject) => {
                                    resolve = _resolve;
                                    reject = _reject;
                                });
                            }
                        }
                    }
                )
            }
        }
        return Promise.resolve();
    }
}
