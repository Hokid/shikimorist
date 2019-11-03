import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../iocTypes';
import {RateStatus, UsersRateApi} from '../api/usersRate';
import {AnimeRate} from './AnimeRate';
import {User} from '../user/User';
import {AnimesApi} from '../api/animes';

@injectable()
export class AnimeRates {
    constructor(
        private api: UsersRateApi,
        private animeApi: AnimesApi,
        private user: User
    ) {}

    async getByAnimeId(id: number): Promise<AnimeRate | null> {
        const user = await this.user.getProfile();

        if (!user) {
            throw new Error('user not found');
        }

        const rate = await this.api.getByTarget(user.id, id);

        if (!rate) {
            return null;
        }

        return new AnimeRate(rate, this.api);
    }

    async create(animeId: number, status: RateStatus): Promise<AnimeRate> {
        const user = await this.user.getProfile();

        if (!user) {
            throw new Error('user not found');
        }

        const rate = await this.api.create(user.id, animeId, {
            episodes: 0,
            rewatches: 0,
            score: 0,
            status
        });

        return new AnimeRate(rate, this.api);
    }

    async delete(id: number): Promise<void> {
        await this.api.delete(id);
    }
}

decorate(inject(TYPES.UsersRateApi) as ParameterDecorator, AnimeRates, 0);
decorate(inject(TYPES.AnimesApi) as ParameterDecorator, AnimeRates, 1);
decorate(inject(TYPES.User) as ParameterDecorator, AnimeRates, 2);
