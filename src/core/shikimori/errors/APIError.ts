export class APIError extends Error {
    constructor(public code: number, public message: string) {
        super(message);
    }

    toJSON() {
        return JSON.stringify({
            code: this.code,
            message: this.message
        });
    }
}

