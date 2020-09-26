import {AxiosFactory} from '../../axios/AxiosFactory';
import {Profile} from './data/profile';

export class ProfileAPI {
    constructor(private axiosFactory: AxiosFactory) {
    }

    async me(): Promise<Profile> {
        const result = await this.axiosFactory
            .createAxios(true)
            .get<Profile>('/api/users/whoami');

        return result.data;
    }
}
