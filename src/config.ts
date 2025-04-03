import {Container} from 'inversify';
import {TYPES} from './iocTypes';

export function injectConfig(container: Container) {
    container.bind<string>(TYPES.config.shikimoriHost).toConstantValue('https://shikimori.one');
    container.bind<string>(TYPES.config.clientId).toConstantValue('d1Xgj-FYGKjj6EnnbCe4y9kTvL64jY_9Pwct5PaWymM');
    container.bind<string>(TYPES.config.clientSecret).toConstantValue('xBHDmmAJUjfpG7hFmtKF4X4PaGwsZwSxEmwsdJPlfMk');
}
