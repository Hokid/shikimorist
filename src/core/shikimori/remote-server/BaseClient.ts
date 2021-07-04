import {Client, InferResponse} from '../../remote-server/Client';
import {Message} from '../../messager/message';
import {UnknownError} from '../errors/UnknownError';
import {NotFoundError} from '../errors/NotFoundError';
import {NotAuthorizedError} from '../errors/NotAuthorizedError';

export abstract class BaseClient extends Client {
    protected async sendCommand<C extends Message = Message>(command: C): Promise<InferResponse<C>> {
        return super.sendCommand<C>(command)
            .catch(error => {
                if (!error && typeof error.code !== 'number') {
                    return Promise.reject(new UnknownError('API unavailable or some unexpected error occurs'));
                }

                switch (error.code) {
                    case 404:
                        return Promise.reject(new NotFoundError(error.message));
                    case 401:
                        return Promise.reject(new NotAuthorizedError(error.message));
                    default:
                        return Promise.reject(new UnknownError('Unknown error'));
                }
            });
    }
}
