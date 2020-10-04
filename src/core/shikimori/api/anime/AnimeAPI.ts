import {AxiosFactory} from '../../axios/AxiosFactory';
import {Anime} from './data/anime';


export class AnimeAPI {
    constructor(private axiosFactory: AxiosFactory) {
    }

    async search(token: string, limit = 5): Promise<Anime[]> {
        const result = await this.axiosFactory
            .createAxios(false)
            .get<Anime[]>('/api/animes', {
                params: {
                    page: 1,
                    limit,
                    search: token
                },
            });

        return result.data;
    }

    async getById(id: number): Promise<Anime> {
        const result = await this.axiosFactory
            .createAxios(false)
            .get<Anime>('/api/animes/' + id);

        return result.data;
    }
}

