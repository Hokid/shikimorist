export class APIError extends Error {
    constructor(public code: number, message: string) {
        super();
    }
}

