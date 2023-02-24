const toggle = document.getElementById("toggle") as HTMLInputElement;
console.log("toggle");

chrome.storage.sync.get("enabled", ({ enabled }) => {
    toggle.checked = enabled;
});

toggle.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    console.log("checked", checked);
    // chrome.storage.sync.set({ enabled: checked });
    chrome.runtime.sendMessage({ action: checked }, function (response) {
        // Handle response from background script if needed
        console.log(response);
    });

    // set local storage to checked
    chrome.storage.sync.set({ enabled: checked });
});
