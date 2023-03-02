let timerId: any;
let refreshEnabled = false;
// let bgEnabled = false;

console.log("Chegg Auto Refresh is running");

// function to refresh the page after 5 seconds if the content is found
async function refreshPage(tab: chrome.tabs.Tab) {
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            console.log("sdfsd");
            const contentFound = !!document.querySelector(
                'div[data-test="no-question"]'
            );
            // console.log("bgEnabled: ", bgEnabled);
            // get bgEnabled from local storage
            chrome.storage.sync.get("bgEnabled", ({ bgEnabled }) => {
                console.log("bgEnabled: ", bgEnabled);
                if (!contentFound && bgEnabled) {
                    document.querySelector("body").style.backgroundColor =
                        "red";
                }
            });

            // console.log("contentFound", contentFound);
            return contentFound;
        },
    });
    console.log("yooo!: ", results);

    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }

    const contentFound = results[0].result;
    // If the content is not found, print question found to console
    if (contentFound) {
        console.log("refreshing");

        // refresh the page after 5 seconds
        // timerId = setTimeout(() => {
        chrome.tabs.reload(tab.id);
        // }, 5000);
    }
    // else if content is found, refresh the page after 5 seconds
    else {
        console.log("Content not found");
        // If the content is found, clear the timer
        clearTimeout(timerId);
        chrome.notifications.create("", {
            title: "Found a question for you!",
            message: "There is a question waiting for you!",
            iconUrl: "/images/chegg-48.png",
            type: "basic",
        });
        refreshEnabled = false;

        chrome.storage.sync.set({ refreshEnabled: false });

        // alert the user that the content is not found
    }
}

// listen for tab refresh
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // console.log("enabled", enabled);
    if (!refreshEnabled) return;
    // console.log("e1");
    if (
        !(
            tab.url?.startsWith("https://expert.chegg.com/expertqna") ||
            tab.url?.startsWith("https://expert.chegg.com/qna/authoring/answer")
        )
    ) {
        // console.log("Not Chegg");
        return;
    }
    // console.log("e2");
    if (changeInfo.status === "complete") {
        // console.log("tab updated", changeInfo, tab);
        setTimeout(() => {
            refreshPage(tab);
        }, 8000);
    }

    return true;
});

// // set enabled to true if the toggle is checked and false if it is not
// chrome.storage.sync.get("refreshEnabled", ({ refreshEnabled }) => {
//     if (refreshEnabled) {
//         refreshEnabled = true;
//     } else {
//         refreshEnabled = false;
//     }
// });

// Add a message listener to listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.refreshEnabled == true) {
        refreshEnabled = true;
        console.log("refresh enabled");
        // Get the active tab
        // const [tab] = await chrome.tabs.query({
        //     active: true,
        //     currentWindow: true,
        // });
        chrome.tabs
            .query({
                active: true,
                currentWindow: true,
            })
            .then((tabs) => {
                const tab = tabs[0];
                console.log("tab", tab);
                if (!tab) return;
                if (
                    !(
                        tab.url?.startsWith(
                            "https://expert.chegg.com/expertqna"
                        ) ||
                        tab.url?.startsWith(
                            "https://expert.chegg.com/qna/authoring/answer"
                        )
                    )
                ) {
                    return true;
                }
                refreshPage(tab);
                // console.log("after ref resh page");
            });
        return true;
    } else if (request.refreshEnabled == false) {
        console.log("refresh disabled");
        refreshEnabled = false;
        return true;
    }
    // else if (request.bgEnabled == true) {
    //     console.log("bg enabled");
    //     bgEnabled = true;
    //     return true;
    // } else if (request.bgEnabled == false) {
    //     console.log("bg disabled");
    //     bgEnabled = false;
    //     return true;
    // }

    return false;
});

// // listen for tab activation
// chrome.tabs.onActivated.addListener(async function (activeInfo) {
//     if (!enabled) return;

//     let queryOptions = { active: true, currentWindow: true };
//     let [tab] = await chrome.tabs.query(queryOptions);
//     if (!tab) {
//         // console.log("no tab found");
//         return;
//     }
//     if (!tab.url?.startsWith("https://expert.chegg.com/expertqna")) {
//         // console.log("Not Chegg");
//         return;
//     }

//     refreshPage(tab);
// });
