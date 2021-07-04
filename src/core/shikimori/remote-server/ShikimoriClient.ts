import {ChanelFactory} from '../../messager/ChanelFactory';
import {BaseClient} from './BaseClient';
import {ProfileApiClient} from './api/profile/ProfileApiClient';
import {ShikimoriApi} from '../shikimori';
import {UserRatesApi} from '../api/user-rates/user-rates-api';
import {ReadCredentials} from '../credentials/read-credentials';
import {AnimeApi} from '../api/anime/anime-api';
import {BrowserAuthorizationClient} from './authorization/BrowserAuthorizationClient';

export class ShikimoriClient extends BaseClient implements ShikimoriApi {
    readonly credentials: ReadCredentials;
    authorization: BrowserAuthorizationClient;
    profile: ProfileApiClient;
    anime: AnimeApi;
    userRates: UserRatesApi;

    constructor(
        channelFactory: ChanelFactory
    ) {
        super(channelFactory.create('shikimori'));

        this.profile = new ProfileApiClient(this.channel);
        this.authorization = new BrowserAuthorizationClient(this.channel);
    }


    async initialize(): Promise<void> {
        await Promise.all([
            this.profile.connect(),
            this.authorization.connect()
        ]);
    }
}
