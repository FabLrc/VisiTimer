let timer;
let counter = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ counter: 0, date: new Date().toDateString() });
});

function updateCounter() {
  const today = new Date().toDateString();
  chrome.storage.local.get(["counter", "date"], function (result) {
    if (result.date === today) {
      counter = result.counter + 1;
    } else {
      counter = 1;
    }
    chrome.storage.local.set({ counter: counter, date: today });
    chrome.runtime.sendMessage({ counter: counter });
  });
}

function checkTab(tab) {
  const isActive =
    tab.url && tab.url.includes("https://www.visiplus-digital-learning.com");
  if (isActive) {
    if (!timer) {
      timer = setInterval(updateCounter, 1000);
    }
  } else {
    clearInterval(timer);
    timer = null;
  }
  updateIcon(isActive);
}

function updateIcon(isActive) {
  console.log(isActive);
  chrome.action.setIcon({
    path: isActive ? "icon_green.png" : "icon_red.png",
  });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    checkTab(tab);
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    checkTab(tab);
  }
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    clearInterval(timer);
    timer = null;
  } else {
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      function (tabs) {
        if (tabs[0]) {
          checkTab(tabs[0]);
        }
      }
    );
  }
});
