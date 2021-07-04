export class Token {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public expiresIn: number,
        public createdAt: number,
    ) {}

    isExpired(): boolean {
        return (this.createdAt + this.expiresIn * 1000) < (Date.now() - 60000);
    }
}
