const TODOS_API_BASE = "http://localhost:3000/todos";

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let payload = {};
    try { payload = await res.json(); } catch (_) {}
    const message = payload && payload.error ? payload.error : `HTTP ${res.status}`;
    throw new Error(message);
  }
  try { return await res.json(); } catch (_) { return null; }
}

async function loadTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "Loading...";
  try {
    const todos = await fetchJson(TODOS_API_BASE);
    list.innerHTML = "";
    if (!todos || !todos.length) {
      const empty = document.createElement("li");
      empty.textContent = "No tasks yet. Create one above.";
      list.appendChild(empty);
      return;
    }
    const now = Date.now();
    for (const todo of todos) {
      const isExpired = new Date(todo.dueAt).getTime() <= now;
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <input type="checkbox" ${todo.isDone ? "checked" : ""} data-id="${todo.id}" aria-label="Mark done">
          <span class="${todo.isDone ? "done" : ""}">${todo.content}</span>
          <br>
          <small>
            Reminder: <strong>${formatDateTime(todo.remindAt)}</strong><br>
            Due: <strong>${formatDateTime(todo.dueAt)}</strong><br>
            Status: ${todo.isDone ? "Done" : "Not done"} · Notified: ${todo.isNotified ? "Yes" : "No"} · Sends: ${todo.notificationCount}
          </small>
        </div>
        <div class="actions">
          ${!isExpired ? `<button class="btn-danger" data-action="edit" data-id="${todo.id}" data-content="${encodeURIComponent(todo.content)}">Edit</button>` : ""}
          ${!isExpired ? `<button class=\"btn-danger\" data-action=\"reschedule\" data-id=\"${todo.id}\" data-remind=\"${encodeURIComponent(todo.remindAt || '')}\" data-due=\"${encodeURIComponent(todo.dueAt || '')}\">Reschedule</button>` : ""}
          ${isExpired ? `<button class="btn-danger" data-action="delete" data-id="${todo.id}">Delete</button>` : ""}
        </div>
      `;
      list.appendChild(li);
    }
  } catch (e) {
    list.innerHTML = "";
    const err = document.createElement("li");
    err.textContent = e.message || "Failed to load todos";
    list.appendChild(err);
  }
}

async function onToggleDone(id, checked) {
  await fetchJson(`${TODOS_API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDone: checked })
  });
}

async function onEditContent(id, encoded) {
  const current = decodeURIComponent(encoded || "");
  const next = prompt("Edit content:", current);
  if (next == null || next.trim() === "" || next === current) return;
  await fetchJson(`${TODOS_API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: next })
  });
}

async function onDeleteTodo(id) {
  if (!confirm("Delete this overdue task?")) return;
  await fetchJson(`${TODOS_API_BASE}/${id}`, { method: "DELETE" });
}

async function ensureSubscribed() {
  const statusId = "subStatus";
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setText(statusId, "Push not supported in this browser.");
      return;
    }
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setText(statusId, "Notification permission denied.");
      return;
    }
    const { publicKey } = await fetchJson("/push/public-key");
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
    await fetchJson("/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });
    setText(statusId, "");
    try {
      const reg2 = await navigator.serviceWorker.getRegistration();
      if (reg2 && Notification.permission === "granted") {
        reg2.showNotification("Subscription enabled", {
          body: "You will receive reminders and due notifications.",
        });
      }
    } catch (_) {}
  } catch (e) {
    setText(statusId, e && e.message ? e.message : "Subscribe failed");
  }
}

async function isSubscribed() {
  if (!('serviceWorker' in navigator)) return false;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg || !('pushManager' in reg)) return false;
  const sub = await reg.pushManager.getSubscription();
  return !!sub;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function toInputValue(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  // yyyy-MM-ddTHH:mm
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todoForm");
  const resModal = document.getElementById("resModal");
  const resRemindAt = document.getElementById("resRemindAt");
  const resDueAt = document.getElementById("resDueAt");
  const resSave = document.getElementById("resSave");
  const resCancel = document.getElementById("resCancel");
  let rescheduleTodoId = null;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.getElementById("content").value;
    const remindAt = document.getElementById("remindAt").value.replace("T", " ");
    const dueAt = document.getElementById("dueAt").value.replace("T", " ");
    try {
      // Ensure subscription automatically when adding a task
      try {
        const hasSub = await isSubscribed();
        if (!hasSub) {
          await ensureSubscribed();
          console.log('Auto-subscribed during task creation');
        }
      } catch (_) {}

      await fetchJson(TODOS_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, remindAt, dueAt })
      });
      form.reset();
      await loadTodos();
    } catch (e) {
      alert(e.message || "Create failed");
    }
  });

  const list = document.getElementById("todoList");
  list.addEventListener("change", async (e) => {
    const target = e.target;
    if (target && target.matches("input[type=checkbox][data-id]")) {
      try {
        const id = target.getAttribute("data-id");
        await onToggleDone(id, target.checked);
      } catch (err) {
        alert(err.message || "Update failed");
        await loadTodos();
      }
    }
  });

  list.addEventListener("click", async (e) => {
    const btn = e.target;
    if (!(btn instanceof HTMLElement)) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (!action || !id) return;
    try {
      if (action === "edit") {
        const encoded = btn.getAttribute("data-content") || "";
        await onEditContent(id, encoded);
      } else if (action === "reschedule") {
        rescheduleTodoId = id;
        // Prefill datetime-local inputs
        const rem = decodeURIComponent(btn.getAttribute("data-remind") || "");
        const due = decodeURIComponent(btn.getAttribute("data-due") || "");
        resRemindAt.value = toInputValue(rem);
        resDueAt.value = toInputValue(due);
        resModal.style.display = "block";
      } else if (action === "delete") {
        await onDeleteTodo(id);
      }
      await loadTodos();
    } catch (err) {
      alert(err.message || "Action failed");
    }
  });

  resCancel.addEventListener("click", () => {
    rescheduleTodoId = null;
    resModal.style.display = "none";
  });

  resSave.addEventListener("click", async () => {
    if (!rescheduleTodoId) return;
    try {
      const body = {};
      if (resRemindAt.value) body.remindAt = resRemindAt.value.replace("T", " ");
      if (resDueAt.value) body.dueAt = resDueAt.value.replace("T", " ");
      if (!body.remindAt && !body.dueAt) {
        alert("Please choose at least one time.");
        return;
      }
      await fetchJson(`${TODOS_API_BASE}/${rescheduleTodoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      rescheduleTodoId = null;
      resModal.style.display = "none";
      await loadTodos();
    } catch (e) {
      alert(e.message || "Reschedule failed");
    }
  });

  const subBtn = document.getElementById("subscribeBtn");
  if (subBtn) subBtn.addEventListener("click", ensureSubscribed);

  loadTodos();
});


