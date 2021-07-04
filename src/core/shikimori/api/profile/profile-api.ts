import {Profile} from './data/profile';

export interface ProfileApi {
    me(): Promise<Profile>
}
