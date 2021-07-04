import {OAuthHttpApi} from '../api/oauth/OAuthHttpApi';
import {Token} from './Token';
import {ReadCredentials} from './read-credentials';
import {WriteCredentials} from './write-credentials';
import {BehaviorSubject} from 'rxjs';

export class Credentials implements ReadCredentials, WriteCredentials {
    private oauth!: OAuthHttpApi;
    public token: BehaviorSubject<Token | undefined> = new BehaviorSubject<Token | undefined>(undefined);

    setOAuth(oauth: OAuthHttpApi) {
        this.oauth = oauth;
    }

    setToken(token: Token) {
        this.token.next(token);
    }

    removeToken() {
        this.token.next(undefined);
    }

    async getAccessTokenOrFail(): Promise<string> {
        if (!this.token.value) {
            throw new Error('No token');
        }

        if (this.token.value.isExpired()) {
            // TODO: handle bad refresh token error
            const refreshed = await this.oauth.refreshToken(this.token.value.refreshToken);
            this.token.next(new Token(
                refreshed.access_token,
                refreshed.refresh_token,
                refreshed.expires_in,
                refreshed.created_at
            ));
        }

        return this.token.value.accessToken;
    }
}
