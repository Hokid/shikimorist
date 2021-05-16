import {UserRate} from './data/user-rate';
import {UpdateUserRate} from './data/update-user-rate';
import {CreateUserRate} from './data/create-user-rate';

export interface UserRatesApi {
    findByAnimeId(animeId: number): Promise<UserRate | undefined>;
    getById(rateId: number): Promise<UserRate>;
    updateById(rateId: number, data: UpdateUserRate): Promise<UserRate>;
    createRateForAnime(animeId: number, data: CreateUserRate): Promise<UserRate>;
    deleteById(rateId: number): Promise<void>;
}
