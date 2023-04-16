export interface IParser {
    readonly hosts: {url: string, vpn?: boolean}[];

    checkUrl(host: string, path: string): boolean;

    parse(document: Document, host: string, path: string): string | null;
}
