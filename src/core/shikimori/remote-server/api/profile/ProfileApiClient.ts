import {Chanel} from '../../../../messager/Chanel';
import {Profile} from '../../../api/profile/data/profile';
import {MeRequestMessage} from './channel-messages';
import {ProfileApi} from '../../../api/profile/profile-api';
import {BaseClient} from '../../BaseClient';

export class ProfileApiClient extends BaseClient implements ProfileApi {
    constructor(channel: Chanel) {
        super(channel);
    }

    async me(): Promise<Profile> {
        const message = new MeRequestMessage();
        return this.sendCommand(message);
    }
}
