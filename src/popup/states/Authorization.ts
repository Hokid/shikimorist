import {observable, runInAction} from 'mobx';
import {AuthorizationApi} from '../../core/api/authorization/Auhtorization';
import {IScreenState, Screens} from './types';

export class AuthorizationState {
    @observable isReady: boolean = false;
    @observable isAuthorized: boolean = false;
    @observable error: boolean = false;

    constructor(
        private stateMediator: IScreenState,
        private authApi: AuthorizationApi
    ) {}

    async getReady() {
        if (!this.isReady) {
            try {
                const isAuthorized = await this.authApi.isAuthorized();

                runInAction(() => {
                    this.isAuthorized = isAuthorized;
                    this.error = false;
                    this.isReady = true;
                });
            } catch (error) {
                console.error(error);

                runInAction(() => {
                    this.error = true;
                    this.isReady = true;
                });
            }

            this.authApi.on('updateStatus', (status: boolean) => {
                runInAction(() => {
                    this.isAuthorized = status;
                    this.error = false;
                });
            });
        }
    }

    async signIn() {
        await this.authApi.signIn();
    }

    async signOut() {
        await this.authApi.signOut();
        this.stateMediator.gotoScreen(Screens.SIGN_IN);
    }
}
