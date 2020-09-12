import {Message} from '../../message';

export class ChanelMessage extends Message {
    constructor(
        public name: string,
        public data: any,
        public chanel: string,
        public waitAnswer: boolean = false
    ) {
        super(name, data);
    }
}
