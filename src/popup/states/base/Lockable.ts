import { runInAction } from "mobx";

export class Lockable {
    isLock: boolean = false;

    setLock(flag: boolean): void {
        this.isLock = flag;
    }

    runInAction(block: () => void) {
        if (!this.isLock) {
            runInAction(block);
        }
    }
}
