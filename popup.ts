const refreshToggle = document.getElementById(
    "refresh-toggle"
) as HTMLInputElement;
const bgToggle = document.getElementById("bg-toggle") as HTMLInputElement;

chrome.storage.sync.get("refreshEnabled", ({ refreshEnabled }) => {
    refreshToggle.checked = refreshEnabled;
});

chrome.storage.sync.get("bgEnabled", ({ bgEnabled }) => {
    bgToggle.checked = bgEnabled;
});

refreshToggle.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const isEnabled = target.checked;
    console.log("refresh checked", isEnabled);
    // chrome.storage.sync.set({ enabled: checked });
    chrome.runtime.sendMessage(
        { refreshEnabled: isEnabled },
        function (response) {
            // Handle response from background script if needed
            console.log(response);
        }
    );

    // set local storage to checked
    chrome.storage.sync.set({ refreshEnabled: isEnabled });
});

bgToggle.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const isEnabled = target.checked;
    console.log("bg checked", isEnabled);
    // chrome.storage.sync.set({ enabled: isEnabled });
    chrome.runtime.sendMessage({ bgEnabled: isEnabled }, function (response) {
        // Handle response from background script if needed
        console.log(response);
    });

    // set local storage to isEnabled
    chrome.storage.sync.set({ bgEnabled: isEnabled });
});
