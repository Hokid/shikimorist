const installDetectHelperCodeTemplate = `
window.__SHIKIMORIST_PAGE_SERVER_INSTALLED = window.__SHIKIMORIST_PAGE_SERVER_INSTALLED || (() => {
    let answer = false;
    
    chrome.runtime.onMessage.addListener((msg, _, response) => {
        if (msg.event === 'is-touched-{{tabId}}') {
            response(answer);
            answer = true;
        }
    });
    
    return true;
})();
`;

export function INSTALL_DETECTOR(tabId: number) {
    (window as any).__SHIKIMORIST_PAGE_SERVER_INSTALLED = (window as any).__SHIKIMORIST_PAGE_SERVER_INSTALLED || (() => {
        let answer = false;

        chrome.runtime.onMessage.addListener((msg, _, response) => {
            if (msg.event === 'is-touched-' + tabId) {
                response(answer);
                answer = true;
            }
        });

        return true;
    })();
}

let installPromise: Promise<void> | void;

function install(): Promise<void> {
    installPromise = new Promise((resolve, reject) => {
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

                    tabs.forEach(tab => {
                        chrome.scripting.executeScript({
                            target: {
                                tabId: tab.id as number
                            },
                            // world: 'MAIN',
                            func: INSTALL_DETECTOR,
                            args: [tab.id as number]
                        })
                          .then(() => {
                            chrome.tabs.sendMessage(tab.id as number, {
                                event: `is-touched-${tab.id}`
                            }, (answer?: boolean) => {
                                if (answer === undefined) {
                                    reject();
                                    return;
                                } else if (!answer) {
                                    chrome.scripting.executeScript({
                                        target: {
                                            tabId: tab.id as number
                                        },
                                        // world: 'MAIN',
                                        files: ['content_script.js']
                                    }).then(tabInjected);
                                } else {
                                    tabInjected();
                                }
                            });
                        })
                          .catch(err => console.error('Execute script err: %O', err));
                    })
                }
            );
    });

    return installPromise;
}

export async function ensureInstalled() {
    if (installPromise) {
        return installPromise;
    }

    return install();
}
