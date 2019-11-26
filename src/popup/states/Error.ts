import {action, observable, runInAction} from 'mobx';

export class ErrorState {
    @observable error: Error | string | undefined;
    @observable repeater: (() => any) | undefined;

    @action.bound
    setError(error: Error | string, repeater: () => any) {
        this.error = error;

        if (repeater) {
            this.repeater = () => {
                runInAction(() => {
                    this.error = undefined;
                    this.repeater = undefined;
                });
                repeater();
            }
        }
    }
}
