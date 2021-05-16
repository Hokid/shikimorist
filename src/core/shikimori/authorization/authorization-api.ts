import {Subscribable} from 'rxjs/src/internal/types';
import {BehaviorSubject} from 'rxjs';

export type Status = 'waiting-code' | 'exchanging-code' | 'error' | 'idle';

export interface AuthorizationApi {
    readonly status: BehaviorSubject<Status>;

    signIn(): Promise<void>;

    signOut(): Promise<void>;
}
