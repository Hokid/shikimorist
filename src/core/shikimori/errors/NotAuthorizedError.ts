import {APIError} from './APIError';

export class NotAuthorizedError extends APIError {
    constructor(message: string) {
        super(401, message);
    }
}
