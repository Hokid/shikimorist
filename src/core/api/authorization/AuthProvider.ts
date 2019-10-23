import {AbstractAuthProvider} from '../AbstractAuthProvider';
import {AxiosRequestConfig} from 'axios';
import {injectable} from 'inversify';
import {IAuthorization} from './types';

@injectable()
export class ApiAuthProvider extends AbstractAuthProvider {
    private auth!: IAuthorization;

    setAuthorizationInstance(auth: IAuthorization) {
        this.auth = auth;
    }

    async injectAuthData(request: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        let token = await this.auth.getToken();

        if (token && token.isExpired()) {
            await this.auth.refreshToken();
            token = await this.auth.getToken();
        }

        if (token) {
            request.headers['Authorization'] = 'Bearer ' + token.accessToken;
        }

        return request;
    }

    onFail(): void {
        this.auth.signOut();
    }
}
