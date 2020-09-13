import {Chanel} from '../messager/Chanel';
import {ServerStatus} from './statuses';
import {ServerChangeStatusMessage, ServerStatusRequestMessage} from './channel';
import {Message} from '../messager/message';
import {Handler} from '../messager/bus';

export abstract class Server {
    protected constructor(private channel: Chanel) {
        this.channel.on<ServerStatusRequestMessage>('server-status-request', (_, resolve) => {
            resolve(this.status);
            return true;
        });
    }

    private _status: ServerStatus = 'uninitialized';

    public get status(): ServerStatus {
        return this._status;
    }

    async initialize() {
        await this.changeStatus('initialization');
        try {
            await this.onInitialization();
            await this.changeStatus('initialized');
        } catch (error) {
            await this.changeStatus('error');
            throw error;
        }
    }

    protected async onInitialization(): Promise<void> {
    };

    protected onCommand<C extends Message = Message>(
        name: C extends Message<infer N> ? N : string,
        handler: C extends Message<infer N, infer D, infer R>
            ? Handler<D, R>
            : Handler<unknown, unknown>
    ): void {
        this.channel.on<Message>(name, handler);
    }

    private async changeStatus(status: ServerStatus) {
        this._status = status;
        const message = new ServerChangeStatusMessage(status);
        await this.channel.send(message, false);
    }
}
