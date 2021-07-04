export class Message<Name extends  string = string, Data extends any = any, Response extends any = any> {
    // TS can`t infer Response type if we don`t use Response
    public response: Response | undefined;

    constructor(
        public name: Name,
        public data: Data
    ) {
    }
}
