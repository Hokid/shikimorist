import {Message} from '../../../../messager/message';
import {Profile} from '../../../api/profile/data/profile';

export class MeRequestMessage extends Message<'profile-me', void, Profile> {
    constructor() {
        super('profile-me');
    }
}
