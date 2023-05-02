export interface IParser {
    readonly hosts: {url: string, vpn?: boolean}[];

    checkUrl(location: Location): boolean;

    parse(document: Document): string | null;
}
