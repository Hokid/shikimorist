import {AxiosError} from 'axios';

export function isAuthorizationApiError(error: any): boolean {
    if (typeof error === 'object' && error.isAxioxError) {
        error = error as AxiosError<any>;

        if (error.response.status === 401) {
            return true;
        }
    }

    return false;
}
