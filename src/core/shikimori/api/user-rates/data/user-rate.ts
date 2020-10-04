import {UserRateStatus} from './status';

export interface UserRate {
    id: number;
    target_id: number;
    score: number;
    episodes: number;
    rewatches: number;
    status: UserRateStatus;
}
