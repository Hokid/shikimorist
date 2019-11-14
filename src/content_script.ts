import {getName} from './core/parser';
import {AnimePageServer} from './core/anime-page/AnimePageServer';

const ensurePageLoaded = new Promise((resolve, reject) => {
    const listener = () => {
        resolve();
    };

    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.addEventListener('load', listener);
    }
});

const server = new AnimePageServer(
    async (response) => {
        await ensurePageLoaded;

        const name = getName(
            window.location.host,
            window.location.pathname,
            window.document
        );

        if (name) {
            response({
                name
            });
        } else {
            response(null)
        }
    }
);
