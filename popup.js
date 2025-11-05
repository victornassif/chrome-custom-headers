let headers = []; // single source of truth

const headersDiv = document.getElementById("headers");
const addBtn = document.getElementById("add");
const saveBtn = document.getElementById("save");
const resetBtn = document.getElementById("reset");
const countEl = document.getElementById("count");
const statusEl = document.getElementById("status");

function updateCount() {
  const n = headers.length;
  countEl.textContent = `${n} header${n === 1 ? "" : "s"}`;
}

function persistHeaders() {
  chrome.storage.local.set({ headers });
}

function renderHeaders() {
  headersDiv.innerHTML = "";
  if (headers.length === 0) {
    const hint = document.createElement("div");
    hint.className = "small";
    hint.textContent = "No headers yet. Click 'Add header' to create one.";
    headersDiv.appendChild(hint);
  } else {
    headers.forEach((h, i) => {
      const row = document.createElement("div");
      row.className = "row";

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "name";
      nameInput.placeholder = "Header name (e.g. X-My-Header)";
      nameInput.value = h.name || "";
      nameInput.addEventListener("input", (e) => {
        headers[i].name = e.target.value;
      });

      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.className = "value";
      valueInput.placeholder = "Header value";
      valueInput.value = h.value || "";
      valueInput.addEventListener("input", (e) => {
        headers[i].value = e.target.value;
      });

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn-remove";
      removeBtn.textContent = "✕ Remove";
      removeBtn.title = "Remove this header";
      removeBtn.addEventListener("click", () => {
        headers.splice(i, 1);
        persistHeaders();
        renderHeaders();
      });

      row.appendChild(nameInput);
      row.appendChild(valueInput);
      row.appendChild(removeBtn);
      headersDiv.appendChild(row);
    });
  }

  updateCount();
}

chrome.storage.local.get("headers", (data) => {
  headers = Array.isArray(data.headers) ? data.headers : [];
  renderHeaders();
});

addBtn.addEventListener("click", () => {
  headers.push({ name: "", value: "" });
  renderHeaders();
  persistHeaders();
});

saveBtn.addEventListener("click", () => {
  headers = headers
    .map(h => ({ name: h.name.trim(), value: h.value.trim() }))
    .filter(h => h.name.length > 0);

  persistHeaders();

  statusEl.textContent = "Saved!";
  setTimeout(() => (statusEl.textContent = ""), 1000);
  renderHeaders();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all custom headers?")) {
    headers = [];
    chrome.storage.local.remove("headers", () => {
      renderHeaders();
      updateCount();
      statusEl.textContent = "Cleared!";
      setTimeout(() => (statusEl.textContent = ""), 1000);
    });
  }
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    saveBtn.click();
  }
});
