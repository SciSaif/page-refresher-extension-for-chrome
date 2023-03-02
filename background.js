var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let timerId;
let enabled = false;
console.log("Chegg Auto Refresh is running");
// function to refresh the page after 5 seconds if the content is found
function refreshPage(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield chrome.scripting.executeScript({
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
    });
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
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!enabled)
            return;
        if (!((_a = tab.url) === null || _a === void 0 ? void 0 : _a.startsWith("https://expert.chegg.com/expertqna"))) {
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
});
// set enabled to true if the toggle is checked and false if it is not
chrome.storage.sync.get("enabled", ({ enabled }) => {
    if (enabled) {
        enabled = true;
    }
    else {
        enabled = false;
    }
});
// Add a message listener to listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        // If the request action is "runScript"
        if (request.action == true) {
            console.log("enabled 3");
            enabled = true;
            // Get the active tab
            const [tab] = yield chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            console.log("tab", tab);
            if (!tab)
                return;
            refreshPage(tab);
        }
        else {
            console.log("disabled");
            enabled = false;
        }
        sendResponse({ result: "success" });
        return true;
    });
});
//# sourceMappingURL=background.js.map