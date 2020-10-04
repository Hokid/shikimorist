import {AppParameters} from './parameters/app';
import {HostParameters} from './parameters/host';
import {ProfileAPI} from './api/profile/ProfileAPI';
import {AxiosFactory} from './axios/AxiosFactory';
import {Credentials} from './credentials/Credentials';
import {OAuthAPI} from './api/oauth/OAuthAPI';
import {Authorization} from './authorization/Authorization';
import {Tabs} from '../tabs/Tabs';
import {ReadCredentials} from './credentials/read-credentials';
import {Storage} from '../storage';
import { Token as CachedToken } from './api/oauth/data/token';
import { Token } from './credentials/Token';
import {AnimeAPI} from './api/anime/AnimeAPI';
import {UserRatesAPI} from './api/user-rates/UserRatesAPI';

export class Shikimori {
    private parameters: AppParameters & HostParameters;
    private _credentials: Credentials;
    private axiosFactory: AxiosFactory;
    private oauth: OAuthAPI;

    public get credentials(): ReadCredentials {
        return this._credentials;
    }

    public profile: ProfileAPI;
    public authorization: Authorization;
    public anime: AnimeAPI;
    public userRates: UserRatesAPI;

    constructor(parameters: AppParameters & HostParameters, private storage: Storage) {
        this.storage = storage.addNamespace('shikimori');
        this.parameters = Object.assign({}, parameters);
        this._credentials = new Credentials();
        this.axiosFactory = new AxiosFactory(this._credentials, parameters.host)
        this.oauth = new OAuthAPI(this.parameters, this.axiosFactory);
        this._credentials.setOAuth(this.oauth);
        this.authorization = new Authorization(
            this._credentials,
            this.oauth,
            new Tabs()
        );
        this.profile = new ProfileAPI(this.axiosFactory);
        this.anime = new AnimeAPI(this.axiosFactory);
        this.userRates = new UserRatesAPI(this.axiosFactory);
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
