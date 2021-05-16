import {Server} from '../../../../remote-server/Server';
import {Chanel} from '../../../../messager/Chanel';
import {ProfileHttpApi} from '../../../api/profile/ProfileHttpApi';
import {MeRequestMessage} from './channel-messages';

export class ProfileApiServer extends Server {
    constructor(channel: Chanel, private profileAPI: ProfileHttpApi) {
        super(channel);
    }

    protected async onInitialization(): Promise<void> {
        this.onCommand<MeRequestMessage>('profile-me', (_, resolve, reject) => {
            this.profileAPI.me()
                .then(resolve, reject);
            return true;
        });
    }
}
