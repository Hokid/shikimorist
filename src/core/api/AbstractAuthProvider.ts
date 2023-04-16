import { AxiosRequestConfig } from "axios";

export abstract class AbstractAuthProvider {
    abstract injectAuthData<T extends AxiosRequestConfig>(request: T): Promise<T> | T;

    abstract onFail(): void;
}
