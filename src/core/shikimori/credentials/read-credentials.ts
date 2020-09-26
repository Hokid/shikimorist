import {Subscribable} from 'rxjs';
import {Token} from './Token';

export interface ReadCredentials {
    token: Subscribable<Token | undefined>;
    getAccessTokenOrFail(): Promise<string>;
}
