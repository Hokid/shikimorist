import {AxiosFactory} from '../../axios/AxiosFactory';
import {UserRate} from './data/user-rate';
import {UpdateUserRate} from './data/update-user-rate';
import {CreateUserRate} from './data/create-user-rate';
import {UserRatesApi} from './user-rates-api';

export class UserRatesHttpApi implements UserRatesApi {
    constructor(private axiosFactory: AxiosFactory) {
    }

    // TODO: should i provide userId?
    async findByAnimeId(animeId: number): Promise<UserRate | undefined> {
        const result = await this.axiosFactory
            .createAxios(true)
            .get<UserRate[]>('/api/v2/user_rates', {
                params: {
                    target_id: animeId,
                    target_type: 'Anime'
                },
            });

        return result.data[0] || undefined;
    }

    async getById(rateId: number): Promise<UserRate> {
        const result = await this.axiosFactory
            .createAxios(true)
            .get<UserRate>('/api/v2/user_rates/' + rateId);
        // TODO: should it throw 404?
        return result.data;
    }

    async updateById(rateId: number, data: UpdateUserRate): Promise<UserRate> {
        const result = await this.axiosFactory
            .createAxios(true)
            .put<UserRate>('/api/v2/user_rates/' + rateId, data);

        return result.data;
    }

    // TODO: should i provide userId?
    async createRateForAnime(animeId: number, data: CreateUserRate): Promise<UserRate> {
        const result = await this.axiosFactory
            .createAxios(true)
            .post('/api/v2/user_rates', {
                ...data,
                target_id: animeId,
                target_type: 'Anime'
            });

        return result.data;
    }

    async deleteById(rateId: number): Promise<void> {
        await this.axiosFactory
            .createAxios(true)
            .delete('/api/v2/user_rates/' + rateId);
    }
}
