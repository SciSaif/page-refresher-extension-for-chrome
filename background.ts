let timerId: any;
let enabled = false;

console.log("Chegg Auto Refresh is running");

// function to refresh the page after 5 seconds if the content is found
async function refreshPage(tab: chrome.tabs.Tab) {
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const contentFound = !!document.querySelector(".sc-kMizLa");
            return contentFound;
        },
    });
    // console.log("yooo!: ", results);

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
        // console.log("Content not found");
        // If the content is found, clear the timer
        clearTimeout(timerId);
        chrome.notifications.create("", {
            title: "Found a question for you!",
            message: "There is a question waiting for you!",
            iconUrl: "/images/chegg-48.png",
            type: "basic",
        });
        enabled = false;
        // alert the user that the content is not found
    }
}

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

// listen for tab refresh
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (!enabled) return;

    if (!tab.url?.startsWith("https://expert.chegg.com/expertqna")) {
        // console.log("Not Chegg");
        return;
    }
    if (changeInfo.status === "complete") {
        // console.log("tab updated", changeInfo, tab);
        setTimeout(() => {
            refreshPage(tab);
        }, 10000);
    }
});

// set enabled to true if the toggle is checked and false if it is not
chrome.storage.sync.get("enabled", ({ enabled }) => {
    if (enabled) {
        enabled = true;
    } else {
        enabled = false;
    }
});

// Add a message listener to listen for messages from popup.js
chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
) {
    // If the request action is "runScript"
    if (request.action == true) {
        console.log("enabled");
        enabled = true;
        // Get the active tab
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (!tab) return;
        refreshPage(tab);
    } else {
        console.log("disabled");
        enabled = false;
    }
    sendResponse({ result: "success" });
});
