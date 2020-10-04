import {UserRateStatus} from './status';

export interface UpdateUserRate {
    score?: number;
    episodes?: number;
    rewatches?: number;
    status?: UserRateStatus;
}
