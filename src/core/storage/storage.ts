export abstract class Storage {
    protected constructor(
        // dot-separated-path: one.two
        public readonly namespace: string = ''
    ) {
    }

    abstract get<V>(key: string): Promise<V | undefined>;
    abstract set<V>(key: string, value: V): Promise<void>;
    abstract remove(key: string): Promise<void>;

    addNamespace(this: any, namespace: string): Storage {
        return new this.constructor(namespace);
    }

    protected buildKey(baseKey: string): string {
        if (!this.namespace) {
            return baseKey;
        }

        return this.namespace + '.' + baseKey;
    }
}
