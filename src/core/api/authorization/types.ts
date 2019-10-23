import { Token } from "./Token";
import {EventEmitter} from 'events';

export interface ITokenExchangeResult {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    created_at: number;
}

export interface IAuthorization extends EventEmitter {
    signIn(): Promise<void>;
    signOut(): Promise<void>;
    getToken(): Promise<Token | null>;
    refreshToken(): Promise<void>;
    isAuthorized(): Promise<boolean>;
}
