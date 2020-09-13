import {Chanel} from '../messager/Chanel';
import {ClientStatus} from './statuses';
import {ServerStatusRequestMessage} from './channel';
import {Message} from '../messager/message';

export abstract class Client {
    protected constructor(private channel: Chanel) {
    }

    private _status: ClientStatus = 'wait';

    public get status(): ClientStatus {
        return this._status;
    }

    async connect(): Promise<void> {
        if (this._status === 'connected') {
            return;
        }

        this._status = 'connecting';

        try {
            const message = new ServerStatusRequestMessage();
            const serverStatus = await this.channel.send(message, true);
            if (serverStatus === 'error') {
                throw new Error('Server initialization error');
            } else if (serverStatus === 'initialized') {
                this._status = 'connected';
                await this.onConnect();
            } else {
                return this.connect();
            }
        } catch (error) {
            this._status = 'connection-error';
            throw error;
        }
    }

    protected async sendCommand<C extends Message = Message>(command: C): Promise<C extends Message<any, any, infer R> ? R : unknown> {
        if (this.status !== 'connected') {
            throw new Error('Client is not connected to server');
        }
        return this.channel.send<Message>(command, true);
    }

    protected async onConnect(): Promise<void> {
    };
}
