import {IApiClientFactory} from '../types';
import {AxiosInstance} from 'axios';
import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../../iocTypes';

export interface IProfile {
    id: number;
}

@injectable()
export class ProfileApi {
    private api: AxiosInstance;

    constructor(
        private apiClientFactory: IApiClientFactory
    ) {
        this.api = this.apiClientFactory.createClientWithAuth();
    }

    async me(): Promise<IProfile> {
        const result = await this.api.get('/api/users/whoami');
        return result.data;
    }
}

decorate(inject(TYPES.ApiClientFactory) as ParameterDecorator, ProfileApi, 0);
