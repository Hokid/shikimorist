const installedDetectorScriptTemplate = `
window.__SHIKIMORIST_ANIME_CONTEXT_SERVER_INSTALLED = window.__SHIKIMORIST_ANIME_CONTEXT_SERVER_INSTALLED || (() => {
    let answer = false;
    
    chrome.runtime.onMessage.addListener((msg, _, response) => {
        if (msg === 'installed-{{tabId}}') {
            response(answer);
            answer = true;
        }
    });
    
    return true;
})();
`;

const generateInstalledDetectorScript = (tabId: number) => {
    return installedDetectorScriptTemplate.replace('{{tabId}}', String(tabId));
};

let installedPromise: Promise<void> | void;

function install(): Promise<void> {
    installedPromise = new Promise((resolve, reject) => {
        chrome.tabs
            .query(
                {
                    active: true,
                    currentWindow: true
                },
                (tabs) => {
                    let tabsCounter: number = tabs.length;

                    const tabInjected = () => {
                        tabsCounter--;

                        if (tabsCounter === 0) {
                            resolve();
                        }
                    };

                    tabs.forEach(_ => {
                        chrome.tabs.executeScript(_.id as number, {
                            code: generateInstalledDetectorScript(_.id as number)
                        }, () => {
                            chrome.tabs.sendMessage(_.id as number, `installed-${_.id}`, (answer?: boolean) => {
                                if (answer === undefined) {
                                    reject();
                                    return;
                                } else if (!answer) {
                                    chrome.tabs.executeScript(_.id as number, {
                                        file: 'content_script.js'
                                    }, tabInjected) ;
                                } else {
                                    tabInjected();
                                }
                            });
                        });
                    })
                }
            );
    });

    return installedPromise;
}

export async function ensureInstalled() {
    if (installedPromise) {
        return installedPromise;
    }

    return install();
}
