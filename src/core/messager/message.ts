export abstract class Message<Data extends any = any> {
    static get messageName(): string {
        throw new Error('`messageName` must be overridden');
    }

    protected constructor(
        public data: Data
    ) {
    }
}
