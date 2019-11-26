import {action, observable, runInAction} from 'mobx';

export class LoaderState {
    @observable private counter: number = 0;

    get isLoading(): boolean {
        return this.counter > 0;
    }

    @action.bound
    addLoader(): () => void {
        let isUsed: boolean = false;

        this.counter++;

        return () => {
            if (isUsed) {
                return;
            }

            isUsed = true;

            runInAction(() => {
                this.counter--;
            });
        };
    }
}
