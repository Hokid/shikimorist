import {IApiClientFactory} from '../types';
import {AxiosInstance} from 'axios';
import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../../iocTypes';

export interface IAnime {
    id: number;
    name: string;
    russia: string | null;
    image: {
        original: string;
        preview: string;
    };
}

@injectable()
export class AnimesApi {
    private api: AxiosInstance;

    constructor(
        private apiClientFactory: IApiClientFactory
    ) {
        this.api = this.apiClientFactory.createClient();
    }

    async search(token: string): Promise<IAnime | null> {
        const result = await this.api.get('/api/animes', {
            params: {
                page: 1,
                limit: 1,
                search: token
            },
        });

        return result.data[0] || null;
    }
}

decorate(inject(TYPES.ApiClientFactory) as ParameterDecorator, AnimesApi, 0);
