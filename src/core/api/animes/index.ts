import {IApiClientFactory} from '../types';
import {AxiosInstance} from 'axios';
import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../../iocTypes';

export interface IAnime {
    id: number;
    name: string;
    score: number;
    russian: string | null;
    episodes: number;
    episodes_aired: number;
    url: string;
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

    async search(token: string, limit = 5): Promise<IAnime[]> {
        const result = await this.api.get('/api/animes', {
            params: {
                page: 1,
                limit,
                search: token
            },
        });

        return result.data;
    }
}

decorate(inject(TYPES.ApiClientFactory) as ParameterDecorator, AnimesApi, 0);
