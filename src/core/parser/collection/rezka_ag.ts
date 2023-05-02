import {IParser} from '../types';

export class RezkaAgParser implements IParser {
  hosts = [
    {
      url: 'https://rezka.ag',
      vpn: true
    }
  ];

  checkUrl(location: Location): boolean {
    const {host, pathname: path} = location;
    return host === 'rezka.ag' && /\/animation\/\w+\/\d+/.test(path);
  }

  parse(document: Document): string | null {
    const titleName = document.querySelector(".b-post__origtitle");
		if (titleName && titleName.textContent) {
			const tmp = titleName.textContent.split(' / ');
			return tmp[0] ? tmp[0] : null
		}
		return null;
  }
}
