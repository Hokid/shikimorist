import {
    GetStatusRequestMessage,
    SignInRequestMessage,
    SignOuRequestMessage,
    StatusChangedMessage
} from './channel-messages';
import {AuthorizationApi} from '../../authorization/authorization-api';
import {Server} from '../../../remote-server/Server';
import {Chanel} from '../../../messager/Chanel';

export class BrowserAuthorizationServer extends Server {
    constructor(channel: Chanel, private authorizationApi: AuthorizationApi) {
        super(channel);
    }

    protected async onInitialization(): Promise<void> {
        this.authorizationApi.status.subscribe(
            async status => {
                const message = new StatusChangedMessage(status);
                await this.channel.send(message);
            }
        );

        this.onCommand<GetStatusRequestMessage>(
            'authorization-get-status',
            (_, resolve) => {
                resolve(this.authorizationApi.status.value);

                return true;
            }
        );

        this.onCommand<SignInRequestMessage>(
            'authorization-sign-in',
            (_, resolve, reject) => {
                this.authorizationApi.signIn()
                    .then(resolve, reject);

                return true;
            }
        );

        this.onCommand<SignOuRequestMessage>(
            'authorization-sign-out',
            (_, resolve, reject) => {
                this.authorizationApi.signOut()
                    .then(resolve, reject);

                return true;
            }
        );
    }
}
