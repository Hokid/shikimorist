import {AxiosFactory} from '../../axios/AxiosFactory';
import {Profile} from './data/profile';
import {ProfileApi} from './profile-api';

export class ProfileHttpApi implements ProfileApi {
    constructor(private axiosFactory: AxiosFactory) {
    }

    async me(): Promise<Profile> {
        const result = await this.axiosFactory
            .createAxios(true)
            .get<Profile>('/api/users/whoami');

        return result.data;
    }
}
