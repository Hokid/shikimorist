import {AxiosFactory} from '../../axios/AxiosFactory';
import {AppParameters} from '../../parameters/app';
import {Token} from './data/token';
import {HostParameters} from '../../parameters/host';
import {SignInCallbackParseResult} from './data/sign-in-callback-parse-result';

export class OAuthAPI {
    constructor(
        private parameters: AppParameters & HostParameters,
        private axiosFactory: AxiosFactory
    ) {
    }

    getSignInURL(): string {
        return `${this.parameters.host}/oauth/authorize?client_id=${this.parameters.clientId}&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=`;
    }

    parseSignInCallback(url: string): SignInCallbackParseResult | void {
        const matches = url.match(/\/oauth\/authorize\/([^\/]+?)$/);
        const code = matches ? matches[1] : '';

        if (code) {
            return {
                code
            };
        }
    }

    async refreshToken(refreshToken: string): Promise<Token> {
        const result = await this.axiosFactory.createAxios().post<Token>('/oauth/token', {
            grant_type: 'refresh_token',
            client_id: this.parameters.clientId,
            client_secret: this.parameters.clientSecret,
            refresh_token: refreshToken,
            redirect_uri: '"urn:ietf:wg:oauth:2.0:oob"'
        });

        return result.data;
    }

    async exchangeCode(code: string): Promise<Token> {
        const result = await this.axiosFactory.createAxios().post<Token>('/oauth/token', {
            grant_type: 'authorization_code',
            client_id: this.parameters.clientId,
            client_secret: this.parameters.clientSecret,
            code,
            redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
        });

        return result.data;
    }
}
