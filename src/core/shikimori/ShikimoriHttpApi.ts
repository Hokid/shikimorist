import {AppParameters} from './parameters/app';
import {HostParameters} from './parameters/host';
import {ProfileHttpApi} from './api/profile/ProfileHttpApi';
import {AxiosFactory} from './axios/AxiosFactory';
import {Credentials} from './credentials/Credentials';
import {OAuthHttpApi} from './api/oauth/OAuthHttpApi';
import {BrowserAuthorization} from './authorization/BrowserAuthorization';
import {Tabs} from '../tabs/Tabs';
import {ReadCredentials} from './credentials/read-credentials';
import {Storage} from '../storage';
import {Token as CachedToken} from './api/oauth/data/token';
import {Token} from './credentials/Token';
import {AnimeHttpApi} from './api/anime/AnimeHttpApi';
import {UserRatesHttpApi} from './api/user-rates/UserRatesHttpApi';
import {ProfileApi} from './api/profile/profile-api';
import {AnimeApi} from './api/anime/anime-api';
import {UserRatesApi} from './api/user-rates/user-rates-api';
import {ShikimoriApi} from './shikimori';
import {AuthorizationApi} from './authorization/authorization-api';

export class ShikimoriHttpApi implements ShikimoriApi {
    profile: ProfileApi;
    authorization: AuthorizationApi;
    anime: AnimeApi;
    userRates: UserRatesApi;
    private parameters: AppParameters & HostParameters;
    private axiosFactory: AxiosFactory;
    private oauth: OAuthHttpApi;

    constructor(parameters: AppParameters & HostParameters, private storage: Storage) {
        this.storage = storage.addNamespace('shikimori');
        this.parameters = Object.assign({}, parameters);
        this._credentials = new Credentials();
        this.axiosFactory = new AxiosFactory(this._credentials, parameters.host)
        this.oauth = new OAuthHttpApi(this.parameters, this.axiosFactory);
        this._credentials.setOAuth(this.oauth);
        this.authorization = new BrowserAuthorization(
            this._credentials,
            this.oauth,
            new Tabs()
        );
        this.profile = new ProfileHttpApi(this.axiosFactory);
        this.anime = new AnimeHttpApi(this.axiosFactory);
        this.userRates = new UserRatesHttpApi(this.axiosFactory);
    }

    private _credentials: Credentials;

    get credentials(): ReadCredentials {
        return this._credentials;
    }

    async initialize() {
        const cachedToken = await this.storage.get<CachedToken>('token');

        if (cachedToken) {
            this._credentials.setToken(new Token(
                cachedToken.access_token,
                cachedToken.refresh_token,
                cachedToken.expires_in,
                cachedToken.created_at
            ));
        }

        this._credentials.token.subscribe(async token => {
            if (token) {
                await this.storage.set<CachedToken>('token', {
                    access_token: token.accessToken,
                    refresh_token: token.refreshToken,
                    expires_in: token.expiresIn,
                    created_at: token.createdAt,
                });
                return;
            }

            await this.storage.remove('token');
        });
    }
}
