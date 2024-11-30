// Store active state per tab
const activeTabsMap = new Map();

// Function to update the extension icon
async function updateIcon(tabId, isActive) {
  const path = isActive
    ? {
        16: "icons/icon16.png",
        48: "icons/icon48.png",
        128: "icons/icon128.png",
      }
    : {
        16: "icons/icon16-gray.png",
        48: "icons/icon48-gray.png",
        128: "icons/icon128-gray.png",
      };

  try {
    await chrome.action.setIcon({ tabId, path });
  } catch (error) {
    console.error("Failed to update icon:", error);
  }
}

// Check if React Scan is active in the page
async function checkReactScanState(tabId) {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => {
        return (
          window.__REACT_SCAN__?.ReactScanInternals?.options?.enabled || false
        );
      },
    });
    return result[0]?.result || false;
  } catch (err) {
    console.error("Failed to check React Scan state:", err);
    return false;
  }
}

// Initialize extension state for a tab
async function initializeTab(tabId) {
  // Check if React Scan is already active in the page
  const isReactScanActive = await checkReactScanState(tabId);

  // Update our state map and icon
  activeTabsMap.set(tabId, isReactScanActive);
  await updateIcon(tabId, isReactScanActive);
}

// Inject React Scan script
async function injectReactScan(tabId) {
  try {
    // First, load our local script
    const scriptUrl = chrome.runtime.getURL("react-scan.js");
    const response = await fetch(scriptUrl);
    const scriptContent = await response.text();

    // Then inject it into the page
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: (code) => {
        // Create and inject the script element
        const script = document.createElement("script");
        script.id = "react-scan-script";
        script.textContent = code; // Using the actual code instead of external URL
        (document.head || document.documentElement).appendChild(script);

        // Enable React Scan if it's already initialized
        if (window.__REACT_SCAN__) {
          window.__REACT_SCAN__.ReactScanInternals.options.enabled = true;
        }

        const toolbar = document.getElementById("react-scan-toolbar");
        if (toolbar) {
          toolbar.style.display = "block";
        }
      },
      args: [scriptContent],
    });
  } catch (err) {
    console.error("Failed to inject React Scan:", err);
  }
}

// Remove React Scan script
async function removeReactScan(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => {
        if (window.__REACT_SCAN__) {
          window.__REACT_SCAN__.ReactScanInternals.options.enabled = false;
        }

        const toolbar = document.getElementById("react-scan-toolbar");
        if (toolbar) {
          toolbar.style.display = "none";
        }
      },
    });
  } catch (err) {
    console.error("Failed to remove React Scan:", err);
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  const isActive = !activeTabsMap.get(tab.id);
  activeTabsMap.set(tab.id, isActive);

  await updateIcon(tab.id, isActive);

  if (isActive) {
    await injectReactScan(tab.id);
  } else {
    await removeReactScan(tab.id);
  }
});

// Initialize new tabs
chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.id) {
    await initializeTab(tab.id);
  }
});

// Handle tab updates (e.g., when URL changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Check the actual state in the page
    const isReactScanActive = await checkReactScanState(tabId);

    // Update our state to match the page's state
    activeTabsMap.set(tabId, isReactScanActive);
    await updateIcon(tabId, isReactScanActive);

    // If our state shows active but React Scan isn't active in the page, inject it
    if (isReactScanActive && !(await checkReactScanState(tabId))) {
      await injectReactScan(tabId);
    }
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabsMap.delete(tabId);
});
