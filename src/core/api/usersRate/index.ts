import {IApiClientFactory} from '../types';
import {AxiosInstance} from 'axios';
import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../../iocTypes';

export enum RateStatus {
    planned = 'planned',
    watching = 'watching',
    rewatching = 'rewatching',
    completed = 'completed',
    on_hold = 'on_hold',
    dropped = 'dropped'
}

export interface IRate {
    id: number;
    target_id: number;
    score: number;
    episodes: number;
    rewatches: number;
    status: RateStatus;
}

export interface IRateUpdate {
    score?: number;
    episodes?: number;
    rewatches?: number;
    status?: RateStatus;
}

export interface IRateCreate {
    score: number;
    episodes: number;
    rewatches: number;
    status: RateStatus;
}

@injectable()
export class UsersRateApi {
    private api: AxiosInstance;

    constructor(
        private apiClientFactory: IApiClientFactory
    ) {
        this.api = this.apiClientFactory.createClientWithAuth();
    }

    async getByTarget(userId: number, id: number): Promise<IRate | null> {
        const result = await this.api.get('/api/v2/user_rates', {
            params: {
                target_id: id,
                user_id: userId,
                target_type: 'Anime'
            },
        });

        return result.data[0] || null;
    }

    async getById(id: number): Promise<IRate | null> {
        const result = await this.api.get('/api/v2/user_rates/' + id);

        return result.data || null;
    }

    async update(id: number, data: IRateUpdate): Promise<IRate> {
        const result = await this.api.put('/api/v2/user_rates/' + id, data);

        return result.data;
    }

    async create(userId: number, targetId: number, data: IRateCreate): Promise<IRate> {
        const result = await this.api.post('/api/v2/user_rates', {
            ...data,
            user_id: userId,
            target_id: targetId,
            target_type: 'Anime'
        });

        return result.data;
    }
}

decorate(inject(TYPES.ApiClientFactory) as ParameterDecorator, UsersRateApi, 0);
