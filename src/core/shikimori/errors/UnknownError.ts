import {APIError} from './APIError';

export class UnknownError extends APIError{
    constructor(message: string) {
        super(0, message);
    }
}
