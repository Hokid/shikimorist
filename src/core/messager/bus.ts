export type Handler<Data extends any = any, Response extends any = any> =
    (
        data: Data,
        resolve: (response: Response) => void,
        reject: (error: any) => void
    ) => true | void | Promise<void>;

export abstract class Bus {
    abstract on(chanel: string, name: string, handler: Handler): void;

    abstract off(chanel: string, name: string, handler: Handler): boolean;

    abstract send(chanel: string, name: string, data: any, waitResponse?: boolean): Promise<any>;
}
