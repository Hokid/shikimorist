import {Token} from '../../api/authorization/Token';
import {Tabs} from '../../tabs/Tabs';
import {WriteCredentials} from '../credentials/write-credentials';
import {OAuthAPI} from '../api/oauth/OAuthAPI';
import {BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';
import {TabRemovedMessage, TabRemovedMessageData, TabUpdatedMessage, TabUpdatedMessageData} from '../../tabs/channel';
import {Subscribable} from 'rxjs/src/internal/types';

export type Status = 'waiting-code' | 'exchanging-code' | 'error' | 'idle';

export class Authorization {
    private authorizationTabId: number | undefined;

    constructor(
        private credentials: WriteCredentials,
        private oauth: OAuthAPI,
        private tabs: Tabs,
    ) {
    }

    private _status = new BehaviorSubject<Status>('idle');

    get status(): Subscribable<Status> {
        return this._status;
    }

    async signIn() {
        if (!['idle', 'error'].includes(this._status.value)) {
            await this.tabs.activate(this.authorizationTabId!);
            await this._status
                .pipe(first(value => ['idle', 'error'].includes(value)))
                .toPromise();
            return;
        }

        this._status.next('waiting-code');

        const tab = await this.tabs.create({
            url: this.oauth.getSignInURL(),
            active: true,
        });

        this.authorizationTabId = tab.id;

        this.tabs.on<TabUpdatedMessage>('updated', this.onUpdate);
        this.tabs.on<TabRemovedMessage>('removed', this.onRemoved);

        const completeStatus = await this._status
            .pipe(first(value => ['idle', 'error'].includes(value)))
            .toPromise();

        this.tabs.off<TabUpdatedMessage>('updated', this.onUpdate);
        this.tabs.off<TabRemovedMessage>('removed', this.onRemoved);

        if (this.authorizationTabId !== undefined) {
            await this.tabs.remove(this.authorizationTabId);
        }

        if (completeStatus === 'error') {
            throw new Error('Sign in error. Try again');
        }
    }

    async signOut() {
        this.credentials.removeToken();
    }

    onUpdate = async (data: TabUpdatedMessageData) => {
        if (this._status.value !== 'waiting-code') {
            return;
        }

        if (this.authorizationTabId === data.id && data.url) {
            const parseUrlResult = this.oauth.parseSignInCallback(data.url);

            if (!parseUrlResult) {
                return;
            }

            this._status.next('exchanging-code');

            try {
                const token = await this.oauth.exchangeCode(parseUrlResult.code);
                this.credentials.setToken(new Token(
                    token.access_token,
                    token.refresh_token,
                    token.expires_in,
                    token.created_at
                ));
                this._status.next('idle');
            } catch (error) {
                // TODO: log error
                this._status.next('error');
            }
        }
    };

    onRemoved = async (data: TabRemovedMessageData) => {
        if (this.authorizationTabId === data.id) {
            if (this._status.value === 'waiting-code') {
                this._status.next('error');
            }
        }
    };
}
