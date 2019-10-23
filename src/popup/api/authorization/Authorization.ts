import {IAuthorization} from '../../../core/api/authorization/types';
import {EventEmitter} from 'events';
import {decorate, inject, injectable} from 'inversify';
import {Token} from '../../../core/api/authorization/Token';
import {TYPES} from '../../../iocTypes';
import {Store} from '../../../core/store';
import {CallAuthMethod, Message} from '../../../core/messages';

@injectable()
export class AuthorizationProxy extends EventEmitter implements IAuthorization {
    constructor(
        private store: Store
    ) {
        super();

        chrome.runtime.onMessage.addListener((message: Message) => {
            if (message.event === 'background-auth-update-status') {
                this.emit('updateStatus', message.data);
            }
        });
    }

    async signIn() {
        return new Promise<void>((resolve, reject) => {
            chrome.runtime.sendMessage({
                event: 'auth-method',
                data: 'signIn'
            } as CallAuthMethod, (status) => {
                if (status) {
                    resolve();
                } else {
                    reject();
                }
            })
        });
    }

    signOut() {
        return new Promise<void>((resolve, reject) => {
            chrome.runtime.sendMessage({
                event: 'auth-method',
                data: 'signOut'
            } as CallAuthMethod, (status) => {
                if (status) {
                    resolve();
                } else {
                    reject();
                }
            })
        });
    }

    async refreshToken() {
        return new Promise<void>((resolve, reject) => {
            chrome.runtime.sendMessage({
                event: 'auth-method',
                data: 'refreshToken'
            } as CallAuthMethod, (status) => {
                if (status) {
                    resolve();
                } else {
                    reject();
                }
            })
        });
    }

    async isAuthorized(): Promise<boolean> {
        const data = await this.store.getAuthData();
        return !!data;
    }

    async getToken(): Promise<Token | null> {
        const data = await this.store.getAuthData();

        if (data) {
            return new Token(
                data.access_token,
                data.refresh_token,
                data.expires_in,
                data.created_at,
            );
        }

        return null;
    }
}

decorate(inject(TYPES.Store) as ParameterDecorator, AuthorizationProxy, 0);
