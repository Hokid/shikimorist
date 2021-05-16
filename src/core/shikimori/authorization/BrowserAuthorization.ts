import {Token} from '../../api/authorization/Token';
import {Tabs} from '../../tabs/Tabs';
import {WriteCredentials} from '../credentials/write-credentials';
import {OAuthHttpApi} from '../api/oauth/OAuthHttpApi';
import {BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';
import {TabRemovedMessage, TabRemovedMessageData, TabUpdatedMessage, TabUpdatedMessageData} from '../../tabs/channel';
import {AuthorizationApi, Status} from './authorization-api';


export class BrowserAuthorization implements AuthorizationApi {
    status = new BehaviorSubject<Status>('idle');
    private authorizationTabId: number | undefined;

    constructor(
        private credentials: WriteCredentials,
        private oauth: OAuthHttpApi,
        private tabs: Tabs,
    ) {
    }

    async signIn() {
        if (!['idle', 'error'].includes(this.status.value)) {
            await this.tabs.activate(this.authorizationTabId!);
            await this.status
                .pipe(first(value => ['idle', 'error'].includes(value)))
                .toPromise();
            return;
        }

        this.status.next('waiting-code');

        const tab = await this.tabs.create({
            url: this.oauth.getSignInURL(),
            active: true,
        });

        this.authorizationTabId = tab.id;

        this.tabs.on<TabUpdatedMessage>('updated', this.onUpdate);
        this.tabs.on<TabRemovedMessage>('removed', this.onRemoved);

        const completeStatus = await this.status
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
        if (this.status.value !== 'waiting-code') {
            return;
        }

        if (this.authorizationTabId === data.id && data.url) {
            const parseUrlResult = this.oauth.parseSignInCallback(data.url);

            if (!parseUrlResult) {
                return;
            }

            this.status.next('exchanging-code');

            try {
                const token = await this.oauth.exchangeCode(parseUrlResult.code);
                this.credentials.setToken(new Token(
                    token.access_token,
                    token.refresh_token,
                    token.expires_in,
                    token.created_at
                ));
                this.status.next('idle');
            } catch (error) {
                // TODO: log error
                this.status.next('error');
            }
        }
    };

    onRemoved = async (data: TabRemovedMessageData) => {
        if (this.authorizationTabId === data.id) {
            if (this.status.value === 'waiting-code') {
                this.status.next('error');
            }
        }
    };
}
