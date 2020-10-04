import axios, {AxiosError, AxiosInstance} from 'axios';
import {ReadCredentials} from '../credentials/read-credentials';
import {UnknownError} from '../errors/UnknownError';
import {NotFoundError} from '../errors/NotFoundError';
import {NotAuthorizedError} from '../errors/NotAuthorizedError';

export class AxiosFactory {
    private instances: Map<string, AxiosInstance> = new Map();

    constructor(private credentials: ReadCredentials, private baseURL: string) {
    }

    createAxios(useAccessToken: boolean = false): AxiosInstance {
        if (useAccessToken) {
            if (!this.instances.get('with-access-token')) {
                const instance = axios.create({
                    baseURL: this.baseURL
                });
                this.setupCredentialsInjectInterceptor(instance);
                this.setupErrorsAdapter(instance);
                this.setupLogsInterceptor(instance);
                this.instances.set('with-access-token', instance);
            }

            return this.instances.get('with-access-token')!;
        }

        if (!this.instances.get('default')) {
            const instance = axios.create({
                baseURL: this.baseURL
            });
            this.setupErrorsAdapter(instance);
            this.setupLogsInterceptor(instance);
            this.instances.set('default', instance);
        }

        return this.instances.get('default')!;
    }

    private setupCredentialsInjectInterceptor(axios: AxiosInstance): void {
        axios.interceptors.request.use(
            async config => {
                config.headers['Authorization'] = 'Bearer ' + await this.credentials.getAccessTokenOrFail();
                return config;
            }
        );
    }

    private setupLogsInterceptor(axios: AxiosInstance): void {

    }

    private setupErrorsAdapter(axios: AxiosInstance): void {
        axios.interceptors.response.use(
            undefined,
            (error) => {
                if (!error && !error.response && !error.isAxiosError) {
                    return Promise.reject(new UnknownError('API unavailable or some unexpected error occurs'));
                }

                const axiosError = error as AxiosError;

                switch (axiosError.response!.status) {
                    case 404:
                        return Promise.reject(new NotFoundError(axiosError.message));
                    case 401:
                        return Promise.reject(new NotAuthorizedError(axiosError.message));
                    default:
                        return Promise.reject(new UnknownError('Unknown error'));
                }
            }
        );
    }
}
