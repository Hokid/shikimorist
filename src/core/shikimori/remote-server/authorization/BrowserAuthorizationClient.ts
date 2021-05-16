import {AuthorizationApi, Status} from '../../authorization/authorization-api';
import {BehaviorSubject} from 'rxjs';
import {BaseClient} from '../BaseClient';
import {Chanel} from '../../../messager/Chanel';
import {
    GetStatusRequestMessage,
    SignInRequestMessage,
    SignOuRequestMessage,
    StatusChangedMessage
} from './channel-messages';

export class BrowserAuthorizationClient extends BaseClient implements AuthorizationApi {
    constructor(channel: Chanel) {
        super(channel);
    }

    private _status: BehaviorSubject<Status> = new BehaviorSubject<Status>('idle');

    get status(): BehaviorSubject<Status> {
        return this._status;
    }

    signIn(): Promise<void> {
        const message = new SignInRequestMessage();
        return this.sendCommand(message);
    }

    signOut(): Promise<void> {
        const message = new SignOuRequestMessage();
        return this.sendCommand(message);
    }

    protected async onConnect(): Promise<void> {
        const status = await this.sendCommand<GetStatusRequestMessage>(new GetStatusRequestMessage());

        if (status !== this._status.value) {
            this._status.next(status);
        }

        this.channel.on<StatusChangedMessage>(
            'authorization-status-changed',
            (status: Status) => this._status.next(status)
        );
    }
}
