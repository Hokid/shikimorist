import 'reflect-metadata';
import './sentry';
import {Container} from 'inversify';
import {injectConfig} from './config';
import {Store} from './core/store';
import {TYPES} from './iocTypes';
import {IApiClientFactory} from './core/api/types';
import {ApiClientFactory} from './core/api/ClientFactory';
import {IAuthorization} from './core/api/authorization/types';
import {AuthorizationApi} from './core/api/authorization/Auhtorization';
import {Message} from './core/messages';

const container = new Container({
    defaultScope: "Singleton",
    skipBaseClassChecks: true,
});

injectConfig(container);

container.bind<Store>(TYPES.Store).to(Store);
container.bind<IApiClientFactory>(TYPES.ApiClientFactory).to(ApiClientFactory);
container.bind<IAuthorization>(TYPES.AuthorizationApi).to(AuthorizationApi);

const auth = container.get<IAuthorization>(TYPES.AuthorizationApi);

auth.on('updateStatus', (status) => {
    chrome.runtime.sendMessage({
        event: 'background-auth-update-status',
        data: status
    }).catch(err => console.error('Send message error: %O', err));
});

chrome.runtime.onMessage.addListener((message: Message, _, response) => {
    if (message.event === 'auth-method') {
        switch (message.data) {
            case 'refreshToken':
                auth.refreshToken()
                    .then(
                        () => response(true),
                        () => response(false),
                    );
                break;
            case 'signOut':
                auth.signOut()
                    .then(
                        () => response(true),
                        () => response(false),
                    );
                break;
            case 'signIn':
                auth.signIn()
                    .then(
                        () => response(true),
                        () => response(false),
                    );
                break;
        }
        return true;
    }
});
