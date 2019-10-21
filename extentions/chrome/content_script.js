class AnimeGoParser {
    checkUrl(host, path) {
        return host === 'animego.org' && path.startsWith('/anime');
    }

    parse(document) {
        const name = document.querySelector('[itemprop="name"]');
        const alternatives = document.querySelectorAll('[itemprop="alternativeHeadline"]');
        const allNames = [
            name ? name.innerHTML : null,
            ...Array.from(alternatives).map(_ => _.innerHTML)
        ].filter(Boolean);

        return allNames;
    }
}

const parsers = [
    new AnimeGoParser()
];

function getNames(loc, document) {
    const parser = parsers.find(_ => _.checkUrl(loc.host, loc.pathname));

    if (parser) {
        return parser.parse(document);
    }

    return [];
}

chrome.runtime.sendMessage({
    event: 'clear'
});

window.addEventListener('load', (event) => {
    const names = getNames(window.location, window.document);

    chrome.runtime.sendMessage({
        event: 'got_names',
        data: names
    });
});

