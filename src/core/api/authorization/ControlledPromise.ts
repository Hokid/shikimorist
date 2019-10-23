export class ControlledPromise {
    public promise: Promise<any>;
    public resolve!: (...args: any) => any;
    public reject!: (...args: any) => any;
    public isFulfilled: boolean = false;
    public isRejected: boolean = false;
    public isSettled: boolean = false;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (...args: any) => {
                this.isFulfilled = this.isSettled = true;
                resolve.apply(null, args);
            };
            this.reject = (...args: any) => {
                this.isRejected = this.isSettled = true;
                reject.apply(null, args);
            };
        });
    }
}
