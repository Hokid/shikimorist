import {Store} from '../../store';
import {AxiosInstance} from 'axios';
import {EventEmitter} from 'events';
import {Token} from './Token';
import {decorate, inject, injectable} from 'inversify';
import {IApiClientFactory} from '../types';
import {TYPES} from '../../../iocTypes';
import {IAuthorization} from './types';
import {ControlledPromise} from './ControlledPromise';

type Tab = chrome.tabs.Tab;
type TabChangeInfo = chrome.tabs.TabChangeInfo;

@injectable()
export class AuthorizationApi extends EventEmitter implements IAuthorization {
    private currentTabId: number | null = null;
    private signInPromise: null | ControlledPromise = null;
    private blockExchangeAttempt: boolean = false;
    private api: AxiosInstance;

    constructor(
        private shikimoriHost: string,
        private clientId: string,
        private clientSecret: string,
        private apiClientFactory: IApiClientFactory,
        private store: Store,
    ) {
        super();
        this.api = apiClientFactory.createClient();
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

    async refreshToken() {
        const data = await this.store.getAuthData();
        if (!data) {
            return;
        }

        const result = await this.api.post('/oauth/token', {
            grant_type: 'refresh_token',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: data.refresh_token,
            redirect_uri: '"urn:ietf:wg:oauth:2.0:oob"'
        });

        await this.store.setAuthData(result.data);
    }

    async signIn() {
        if (this.signInPromise && this.currentTabId) {
            chrome.tabs.get(this.currentTabId, tab => {
                if (!tab.active) {
                    chrome.tabs.update(
                        this.currentTabId as number,
                        {active: true}
                    );
                }
            });
            return this.signInPromise.promise;
        }

        const tab = await this.createTab();

        this.currentTabId = tab.id as number;
        this.signInPromise = new ControlledPromise();

        chrome.tabs.onUpdated.addListener(this.onUpdate);

        return this.signInPromise.promise;
    }

    async signOut() {
        await this.store.setAuthData(null);
        this.emit('updateStatus', false);
    }

    onUpdate = async (tabId: number, info: TabChangeInfo) => {
        const {
            currentTabId,
            signInPromise
        } = this;

        if (tabId === currentTabId && info.url) {
            if (signInPromise && !signInPromise.isSettled) {
                if (this.isUrlWithCode(info.url)) {
                    if (!this.blockExchangeAttempt) {
                        this.blockExchangeAttempt = true;

                        try {
                            const code = this.getCodeFromUrl(info.url);

                            await this.exchangeCode(code);

                            this.emit('updateStatus', true);

                            signInPromise.resolve();
                        } catch (error) {
                            signInPromise.reject(error);
                        }

                        chrome.tabs.onUpdated.removeListener(this.onUpdate);
                        chrome.tabs.remove(currentTabId);

                        this.blockExchangeAttempt = false;
                        this.signInPromise = null;
                        this.currentTabId = null;
                    }
                }
            } else {
                chrome.tabs.onUpdated.removeListener(this.onUpdate);
                chrome.tabs.remove(currentTabId);
            }
        }
    };

    private async exchangeCode(code: string): Promise<any> {
        const result = await this.api.post('/oauth/token', {
            grant_type: 'authorization_code',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code,
            redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
        });
        await this.store.setAuthData(result.data);
    }

    private async createTab(): Promise<Tab> {
        return new Promise<Tab>((resolve, reject) => {
            chrome.tabs.create({
                active: true,
                url: this.buildSignInUrl()
            }, tab => {
                resolve(tab);
            });
        });
    }

    private isUrlWithCode(url: string) {
        return /\/oauth\/authorize\/[^\/]+?$/.test(url);
    }

    private getCodeFromUrl(url: string): string {
        const matches = url.match(/\/oauth\/authorize\/([^\/]+?)$/);
        return matches ? matches[1] : '';
    }

    private buildSignInUrl(): string {
        return `${this.shikimoriHost}/oauth/authorize?client_id=${this.clientId}&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=`;
    }
}

decorate(inject(TYPES.config.shikimoriHost) as ParameterDecorator, AuthorizationApi, 0);
decorate(inject(TYPES.config.clientId) as ParameterDecorator, AuthorizationApi, 1);
decorate(inject(TYPES.config.clientSecret) as ParameterDecorator, AuthorizationApi, 2);
decorate(inject(TYPES.ApiClientFactory) as ParameterDecorator, AuthorizationApi, 3);
decorate(inject(TYPES.Store) as ParameterDecorator, AuthorizationApi, 4);
