async function updateRules(headers) {
  const rules = headers.map((header, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: header.name,
          operation: "set",
          value: header.value
        }
      ]
    },
    condition: {
      urlFilter: "*",
      resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "script"]
    }
  }));

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingIds = existingRules.map((r) => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingIds,
    addRules: rules
  });
}

chrome.storage.local.get("headers", (data) => {
  const headers = (data.headers || [])
    .filter(h => h.name && h.name.trim().length > 0)
    .map((h, i) => ({
      id: i + 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: h.name.trim(), operation: "set", value: h.value || "" }
        ]
      },
      condition: {
        urlFilter: "*",
        resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "script"]
      }
    }));

  chrome.declarativeNetRequest.updateDynamicRules(
    { removeRuleIds: Array.from({ length: 100 }, (_, k) => k + 1), addRules: headers },
    () => console.log("Rules updated:", headers.length)
  );
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.headers) {
    updateRules(changes.headers.newValue || []);
  }
});
