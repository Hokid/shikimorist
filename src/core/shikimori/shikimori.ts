import {ReadCredentials} from './credentials/read-credentials';
import {ProfileApi} from './api/profile/profile-api';
import {AnimeApi} from './api/anime/anime-api';
import {UserRatesApi} from './api/user-rates/user-rates-api';
import {AuthorizationApi} from './authorization/authorization-api';

export interface ShikimoriApi {
    readonly credentials: ReadCredentials;
    profile: ProfileApi;
    authorization: AuthorizationApi;
    anime: AnimeApi;
    userRates: UserRatesApi;

    initialize(): Promise<void>;
}
