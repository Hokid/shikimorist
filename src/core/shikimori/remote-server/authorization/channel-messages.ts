import {Status} from "../../authorization/authorization-api";
import {Message} from "../../../messager/message";

export class GetStatusRequestMessage extends Message<'authorization-get-status', void, Status> {
    constructor() {
        super('authorization-get-status');
    }
}

export class StatusChangedMessage extends Message<'authorization-status-changed', Status> {
    constructor(status: Status) {
        super('authorization-status-changed', status);
    }
}

export class SignInRequestMessage extends Message<'authorization-sign-in', void, void> {
    constructor() {
        super('authorization-sign-in');
    }
}

export class SignOuRequestMessage extends Message<'authorization-sign-out', void, void> {
    constructor() {
        super('authorization-sign-out');
    }
}
