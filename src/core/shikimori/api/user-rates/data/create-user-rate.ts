import {UserRateStatus} from './status';

export interface CreateUserRate {
    score: number;
    episodes: number;
    rewatches: number;
    status: UserRateStatus;
}
