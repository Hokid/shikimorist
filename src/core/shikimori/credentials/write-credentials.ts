import {Token} from './Token';

export interface WriteCredentials {
    setToken(token: Token): void;
    removeToken(): void;
}
