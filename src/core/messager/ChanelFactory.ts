import {Bus} from './bus';
import {Chanel} from './Chanel';

export class ChanelFactory {
    constructor(private bus: Bus) {
    }

    create(chanel: string): Chanel {
        return new Chanel(chanel, this.bus);
    }
}
