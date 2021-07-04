export class ChanelResponse {
    constructor(
        public isFail: boolean,
        public data?: any,
        public error?: any
    ) {
    }
}

export class ChanelSuccessResponse extends ChanelResponse {
    constructor(data?: any) {
        super(
            false,
            data
        );
    }
}

export class ChanelFailResponse extends ChanelResponse {
    constructor(error?: any) {
        super(
            true,
            undefined,
            error
        );
    }
}
