import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Container} from 'inversify';
import {IApiClientFactory} from '../core/api/types';
import {TYPES} from '../iocTypes';
import {ApiClientFactory} from '../core/api/ClientFactory';
import {AbstractAuthProvider} from '../core/api/AbstractAuthProvider';
import {ApiAuthProvider} from '../core/api/authorization/AuthProvider';
import {injectConfig} from '../config';
import {AnimesApi} from '../core/api/animes';
import {Store} from '../core/store';
import {IAuthorization} from '../core/api/authorization/types';
import {AuthorizationProxy} from './api/authorization/Authorization';
import {UsersRateApi} from '../core/api/usersRate';
import {User} from '../core/user/User';
import {AnimeRates} from '../core/anime-rate/AnimeRates';
import {Animes} from '../core/animes/Animes';
import {ProfileApi} from '../core/api/profile';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faStar, faStarHalf, faChevronLeft, faList, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';

library.add(
    faStar, faStarHalf, faChevronLeft, faList, faPlus, faMinus
);

const container = new Container({
    defaultScope: "Singleton",
    skipBaseClassChecks: true,
});

injectConfig(container);

container.bind<Store>(TYPES.Store).to(Store);
container.bind<AbstractAuthProvider>(TYPES.ApiDefaultAuthProvider).to(ApiAuthProvider);
container.bind<IApiClientFactory>(TYPES.ApiClientFactory).to(ApiClientFactory);
container.bind<IAuthorization>(TYPES.AuthorizationApi).to(AuthorizationProxy);
container.get<ApiAuthProvider>(TYPES.ApiDefaultAuthProvider).setAuthorizationInstance(
    container.get<IAuthorization>(TYPES.AuthorizationApi)
);
container.bind<AnimesApi>(TYPES.AnimesApi).to(AnimesApi);
container.bind<UsersRateApi>(TYPES.UsersRateApi).to(UsersRateApi);
container.bind<ProfileApi>(TYPES.ProfileApi).to(ProfileApi);
container.bind<User>(TYPES.User).to(User);
container.bind<Animes>(TYPES.Animes).to(Animes);
container.bind<AnimeRates>(TYPES.AnimeRates).to(AnimeRates);


ReactDOM.render(<App container={container}/>, document.getElementById('root'));
