import {AxiosRequestConfig} from "axios";

export abstract class AbstractAuthProvider {
    abstract injectAuthData(request: AxiosRequestConfig): Promise<AxiosRequestConfig> | AxiosRequestConfig;

    abstract onFail(): void;
}
