import {AbstractAuthProvider} from "./AbstractAuthProvider";
import {AxiosInstance, AxiosResponse} from "axios";

export interface IApiClientFactory {
    createClient(): AxiosInstance;

    createClientWithAuth(authProvider?: AbstractAuthProvider): AxiosInstance;
}

export interface ApiResponse$Data<T> {
    result: T;
    error?: string;
}

export type ApiResponse<T = any> = AxiosResponse<ApiResponse$Data<T> | undefined>;
