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

const generateInstallDetectHelperCode = (tabId: number) => {
    return installDetectHelperCodeTemplate.replace('{{tabId}}', '' + tabId);
};

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

                    tabs.forEach(_ => {
                        chrome.tabs.executeScript(_.id as number, {
                            code: generateInstallDetectHelperCode(_.id as number)
                        }, () => {
                            chrome.tabs.sendMessage(_.id as number, {
                                event: `is-touched-${_.id}`
                            }, (answer?: boolean) => {
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

    return installPromise;
}

export async function ensureInstalled() {
    if (installPromise) {
        return installPromise;
    }

    return install();
}
