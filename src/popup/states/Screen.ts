import {action, observable} from 'mobx';
import {Screens} from './types';

export class ScreenState {
    @observable stack: Screens[] = [];

    get current() {
        if (this.stack.length === 0) {
            return;
        }

        return this.stack[this.stack.length - 1];
    }

    @action.bound
    push(screen: Screens) {
        this.stack.push(screen);
    }

    @action.bound
    goBack() {
        if (this.stack.length > 0) {
            this.stack.pop();
        }
    }
}
