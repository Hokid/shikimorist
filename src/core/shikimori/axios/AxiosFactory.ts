import axios, {AxiosInstance} from 'axios';
import {ReadCredentials} from '../credentials/read-credentials';

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
                this.setupLogsInterceptor(instance);
                this.instances.set('with-access-token', instance);
            }

            return this.instances.get('with-access-token')!;
        }

        if (!this.instances.get('default')) {
            const instance = axios.create({
                baseURL: this.baseURL
            });
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
}
