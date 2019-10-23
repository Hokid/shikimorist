import {decorate, inject, injectable} from 'inversify';
import {TYPES} from '../../iocTypes';
import {IProfile, ProfileApi} from '../api/profile';
import {IAuthorization} from '../api/authorization/types';
import {Store} from '../store';

@injectable()
export class User {
    constructor(
        private auth: IAuthorization,
        private profileApi: ProfileApi,
        private store: Store,
    ) {
        auth.on('updateStatus', this.onUpdateStatus)
    }

    async getProfile(): Promise<IProfile | null> {
        if (!await this.auth.isAuthorized()) {
            return null;
        }

        let user = await this.store.getUser();

        if (user) {
            return user;
        }

        user = await this.profileApi.me();

        await this.store.setUser(user);

        return user;
    }

    private onUpdateStatus = async (status: boolean) => {
        if (!status) {
            await this.store.setUser(null);
        }
    };
}

decorate(inject(TYPES.AuthorizationApi) as ParameterDecorator, User, 0);
decorate(inject(TYPES.ProfileApi) as ParameterDecorator, User, 1);
decorate(inject(TYPES.Store) as ParameterDecorator, User, 2);
