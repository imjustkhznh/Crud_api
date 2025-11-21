// Modal edit task chuyên nghiệp
function showEditModal(currentValue) {
  return new Promise(resolve => {
    let modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.background = 'rgba(0,0,0,0.3)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
      <div style="background:#fff;padding:20px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);width:300px;height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
        <h3 style='margin-bottom:16px;color:#3498db;font-size:1.2em;'>Edit Task Name</h3>
        <input id='editTaskInput' type='text' value="${currentValue.replace(/"/g, '&quot;')}" style='width:96%;padding:10px 8px;font-size:1em;border-radius:10px;border:2px solid #e0e0e0;margin-bottom:16px;' />
        <div style='display:flex;gap:16px;justify-content:center;'>
          <button id='saveEditTask' style='background:#3498db;color:#fff;padding:10px 20px;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:1em;'>Save</button>
          <button id='cancelEditTask' style='background:#eee;color:#333;padding:10px 20px;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:1em;'>Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const input = modal.querySelector('#editTaskInput');
    input.focus();
    input.select();
    modal.querySelector('#saveEditTask').onclick = () => {
      const value = input.value;
      document.body.removeChild(modal);
      resolve(value);
    };
    modal.querySelector('#cancelEditTask').onclick = () => {
      document.body.removeChild(modal);
      resolve(null);
    };
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        modal.querySelector('#saveEditTask').click();
      }
      if (e.key === 'Escape') {
        modal.querySelector('#cancelEditTask').click();
      }
    });
  });
}

// Hiển thị thông báo trạng thái
function showStatus(message, type = 'success') {
  const statusMsg = document.getElementById('statusMsg');
  if (!statusMsg) return;

  // Ensure the status message container is visible
  statusMsg.style.display = 'block';

  // Build notification HTML
  const kind = type === 'error' ? 'error' : (type === 'info' ? 'info' : 'success');
  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };
  statusMsg.innerHTML = `
    <div class="notif ${kind}">
      <span class="icon material-icons">${icons[kind]}</span>
      <div class="body">${message}</div>
      <button class="close" aria-label="Dismiss">&times;</button>
    </div>
  `;

  // Show with animation
  statusMsg.classList.add('visible');

  // Auto-hide after 3 seconds
  clearTimeout(statusMsg._hideTimer);
  statusMsg._hideTimer = setTimeout(() => {
    statusMsg.classList.remove('visible');
    statusMsg.style.display = 'none';
  }, 3000);

  // Close button
  const closeBtn = statusMsg.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      statusMsg.classList.remove('visible');
      statusMsg.style.display = 'none';
    });
  }
}
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

let currentFilter = 'all'; // 'all', 'active', 'done'
let currentPage = 1;
const PAGE_SIZE = 5;


async function loadTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "Loading...";
  try {
    const todos = await fetchJson(TODOS_API_BASE);
    list.innerHTML = "";
    let filtered = todos || [];
    const nowMs = Date.now();
    if (currentFilter === 'active') filtered = filtered.filter(t => !t.isDone);
    if (currentFilter === 'done') filtered = filtered.filter(t => t.isDone);
    if (currentFilter === 'upcoming') {
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(t => {
        if (t.isDone) return false;
        const due = new Date(t.dueAt).getTime();
        return !Number.isNaN(due) && due >= nowMs && due <= (nowMs + sevenDays);
      });
    }

    // Phân trang
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageTodos = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    if (!pageTodos.length) {
      const empty = document.createElement("li");
      empty.textContent = "No tasks yet. Create one above.";
      list.appendChild(empty);
      return;
    }
    const now = Date.now();
    for (const todo of pageTodos) {
      const now = Date.now();
      const remindAt = new Date(todo.remindAt).getTime();
      const dueAt = new Date(todo.dueAt).getTime();
      let borderColor = '#4caf50'; // xanh lá: chưa thông báo
      if (todo.isDone) borderColor = '#aaa'; // xám: đã hoàn thành
      else if (now >= dueAt) borderColor = '#dc3545'; // đỏ: đã đến hạn
      else if (now >= remindAt) borderColor = '#ff9800'; // cam: đã remind

      const li = document.createElement("li");
      li.style.borderLeft = `8px solid ${borderColor}`;
      // Badge màu theo tag
      let tagColor = '#2196f3';
      if (todo.tag === 'personal') tagColor = '#4caf50';
      if (todo.tag === 'urgent') tagColor = '#f44336';
      if (todo.tag === 'study') tagColor = '#ff9800';
      li.innerHTML = `
        <div>
          <input type="checkbox" ${todo.isDone ? "checked" : ""} data-id="${todo.id}" aria-label="Mark done">
          <span class="tag-badge" style="background:${tagColor};color:#fff;padding:2px 8px;border-radius:12px;margin-right:8px;">${todo.tag || 'work'}</span>
          <span class="${todo.isDone ? "done" : ""}">${todo.content}</span>
          <br>
          <small>
            Reminder: <strong>${formatDateTime(todo.remindAt)}</strong><br>
            Due: <strong>${formatDateTime(todo.dueAt)}</strong><br>
          </small>
        </div>
        <div class="actions">
          ${now < dueAt ? `<button class="btn-danger" data-action="edit" data-id="${todo.id}" data-content="${encodeURIComponent(todo.content)}">Edit</button>` : ""}
          ${now < dueAt ? `<button class=\"btn-danger\" data-action=\"reschedule\" data-id=\"${todo.id}\" data-remind=\"${encodeURIComponent(todo.remindAt || '')}\" data-due=\"${encodeURIComponent(todo.dueAt || '')}\">Reschedule</button>` : ""}
          ${now >= dueAt ? `<button class="btn-danger" data-action="delete" data-id="${todo.id}">Delete</button>` : ""}
        </div>
      `;
      list.appendChild(li);
    }

    // Thêm nút chuyển trang
    const pagination = document.createElement("div");
    pagination.style.textAlign = "center";
    pagination.style.margin = "16px 0";
    pagination.innerHTML = `
      <button ${currentPage === 1 ? "disabled" : ""} id="prevPage">Prev</button>
      <span> Trang ${currentPage} / ${totalPages} </span>
      <button ${currentPage === totalPages ? "disabled" : ""} id="nextPage">Next</button>
    `;
    list.appendChild(pagination);

    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        loadTodos();
      }
    });
    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadTodos();
      }
    });
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
  const next = await showEditModal(current);
  if (next == null || next.trim() === "" || next === current) return;
  await fetchJson(`${TODOS_API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: next })
  });
// (end of function)

// Modal edit task chuyên nghiệp
function showEditModal(currentValue) {
  return new Promise(resolve => {
    let modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.background = 'rgba(0,0,0,0.3)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
      <div style="background:#fff;padding:20px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);width:300px;height:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
        <h3 style='margin-bottom:16px;color:#3498db;font-size:1.2em;'>Edit Task Name</h3>
        <input id='editTaskInput' type='text' value="${currentValue.replace(/"/g, '&quot;')}" style='width:96%;padding:10px 8px;font-size:1em;border-radius:10px;border:2px solid #e0e0e0;margin-bottom:16px;' />
        <div style='display:flex;gap:16px;justify-content:center;'>
          <button id='saveEditTask' style='background:#3498db;color:#fff;padding:10px 20px;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:1em;'>Save</button>
          <button id='cancelEditTask' style='background:#eee;color:#333;padding:10px 20px;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:1em;'>Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const input = modal.querySelector('#editTaskInput');
    input.focus();
    input.select();
    modal.querySelector('#saveEditTask').onclick = () => {
      const value = input.value;
      document.body.removeChild(modal);
      resolve(value);
    };
    modal.querySelector('#cancelEditTask').onclick = () => {
      document.body.removeChild(modal);
      resolve(null);
    };
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        modal.querySelector('#saveEditTask').click();
      }
      if (e.key === 'Escape') {
        modal.querySelector('#cancelEditTask').click();
      }
    });
  });
}
}

async function onDeleteTodo(id) {
  // Custom confirm popup
  const confirmed = await showDeleteConfirm();
  if (!confirmed) return;
  await fetchJson(`${TODOS_API_BASE}/${id}`, { method: "DELETE" });
// Hiển thị popup xác nhận xóa
function showDeleteConfirm() {
  return new Promise(resolve => {
    // Tạo modal
    let modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.background = 'rgba(0,0,0,0.3)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
      <div style="background:#fff;padding:32px 24px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);max-width:320px;text-align:center;">
        <h3 style="margin-bottom:16px;color:#dc3545;font-size:1.2em;">Delete Confirmation</h3>
        <p style="margin-bottom:24px;">Are you sure you want to delete this task?</p>
        <button id="confirmDelete" style="background:#dc3545;color:#fff;padding:10px 24px;border:none;border-radius:8px;font-weight:600;margin-right:12px;cursor:pointer;">Delete</button>
        <button id="cancelDelete" style="background:#eee;color:#333;padding:10px 24px;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#confirmDelete').onclick = () => {
      document.body.removeChild(modal);
      resolve(true);
    };
    modal.querySelector('#cancelDelete').onclick = () => {
      document.body.removeChild(modal);
      resolve(false);
    };
  });
}
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
    // ...existing code...
  const form = document.getElementById("todoForm");
  const resModal = document.getElementById("resModal");
  const resRemindAt = document.getElementById("resRemindAt");
  const resDueAt = document.getElementById("resDueAt");
  const resSave = document.getElementById("resSave");
  const resCancel = document.getElementById("resCancel");
  const remindAtInput = document.getElementById("remindAt");
  const dueAtInput = document.getElementById("dueAt");
  const remindersPill = document.getElementById("remindersPill");
  const tagSelect = document.getElementById("tag");
  const cancelBtn = document.getElementById("cancel");
  
  let rescheduleTodoId = null;
  let isReminderMode = false; // Track if we're in reminder setting mode
  
  // REMINDERS button - Show modal for setting reminder and due times
  remindersPill.addEventListener("click", (e) => {
    e.preventDefault();
    isReminderMode = true;
    remindersPill.classList.add("active");
    
    // Prefill with current values if they exist
    resRemindAt.value = remindAtInput.value || "";
    resDueAt.value = dueAtInput.value || "";
    
    // Change modal title and button text
    resModal.querySelector("h3").textContent = "⏰ Set Reminder & Due Time";
    resSave.textContent = "Set Times";
    
    resModal.style.display = "block";
  });
  
  // Save reminder times
  resSave.addEventListener("click", async () => {
    if (!isReminderMode) {
      // Original reschedule logic
      if (!rescheduleTodoId) return;
      try {
        const body = {};
        if (resRemindAt.value) body.remindAt = resRemindAt.value.replace("T", " ");
        if (resDueAt.value) body.dueAt = resDueAt.value.replace("T", " ");
        if (!body.remindAt && !body.dueAt) {
          showStatus("Please select at least one time.", 'error');
          return;
        }
        const now = new Date();
        if (body.remindAt && new Date(body.remindAt) < now) {
          showStatus('Reminder time cannot be in the past!', 'error');
          return;
        }
        if (body.dueAt && new Date(body.dueAt) < now) {
          showStatus('Due time cannot be in the past!', 'error');
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
        showStatus('Rescheduled successfully!', 'success');
      } catch (e) {
        showStatus(e.message || "Reschedule failed!", 'error');
      }
    } else {
      // New reminder setting logic
      const now = new Date();
      
      if (resRemindAt.value && new Date(resRemindAt.value) < now) {
        showStatus('Reminder time cannot be in the past!', 'error');
        return;
      }
      if (resDueAt.value && new Date(resDueAt.value) < now) {
        showStatus('Due time cannot be in the past!', 'error');
        return;
      }
      
      // Set the values in the hidden inputs
      if (resRemindAt.value) remindAtInput.value = resRemindAt.value;
      if (resDueAt.value) dueAtInput.value = resDueAt.value;
      
      isReminderMode = false;
      resModal.style.display = "none";
      showStatus('Reminder times set successfully!', 'success');
    }
  });
  
  // Cancel button for reminders
  resCancel.addEventListener("click", () => {
    if (isReminderMode) {
      isReminderMode = false;
      remindersPill.classList.remove("active");
    } else {
      rescheduleTodoId = null;
    }
    resModal.style.display = "none";
  });
  
  // Cancel form button
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    remindAtInput.value = "";
    dueAtInput.value = "";
    remindersPill.classList.remove("active");
    tagSelect.value = "work";
    showStatus("Form cleared", "success");
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = document.getElementById("content").value;
    let remindAt = document.getElementById("remindAt").value;
    let dueAt = document.getElementById("dueAt").value;
    const tag = document.getElementById("tag").value;
    const now = new Date();
    
    // If content is empty, show error
    if (!content || content.trim() === "") {
      showStatus('Task content cannot be empty!', 'error');
      return;
    }

    // Set default dueAt to tomorrow if not provided
    if (!dueAt) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueAt = tomorrow.toISOString().slice(0, 16).replace("T", " ");
    } else {
      dueAt = dueAt.replace("T", " ");
    }

    // Set default remindAt to now if not provided
    if (!remindAt) {
      remindAt = now.toISOString().slice(0, 16).replace("T", " ");
    } else {
      remindAt = remindAt.replace("T", " ");
    }

    if (new Date(remindAt) < now) {
      showStatus('Reminder time cannot be in the past!', 'error');
      return;
    }
    if (new Date(dueAt) < now) {
      showStatus('Due time cannot be in the past!', 'error');
      return;
    }
    try {
      // Ensure automatic notification subscription when adding a task
      try {
        const hasSub = await isSubscribed();
        if (!hasSub) {
          await ensureSubscribed();
          console.log('Automatically subscribed to notifications when creating a task');
        }
      } catch (_) {}

      await fetchJson(TODOS_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, remindAt, dueAt, tag })
      });
      form.reset();
      await loadTodos();
      showStatus('Thêm công việc thành công!', 'success');
    } catch (e) {
      showStatus(e.message || "Failed to add task!", 'error');
    }
  });

  const list = document.getElementById("todoList");
  list.addEventListener("change", async (e) => {
    const target = e.target;
    if (target && target.matches("input[type=checkbox][data-id]")) {
      try {
        const id = target.getAttribute("data-id");
        await onToggleDone(id, target.checked);
        showStatus('Status updated successfully!', 'success');
      } catch (err) {
        showStatus(err.message || "Status update failed!", 'error');
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
        const current = decodeURIComponent(encoded || "");
        const next = await showEditModal(current);
        if (next != null && next.trim() !== "" && next !== current) {
          await fetchJson(`${TODOS_API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: next })
          });
          showStatus('Content updated successfully!', 'success');
        }
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
        showStatus('Deleted successfully!', 'success');
      }
      await loadTodos();
    } catch (err) {
      showStatus(err.message || "Action failed!", 'error');
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
        showStatus("Please select at least one time.", 'error');
        return;
      }
      const now = new Date();
      if (body.remindAt && new Date(body.remindAt) < now) {
        showStatus('Reminder time cannot be in the past!', 'error');
        return;
      }
      if (body.dueAt && new Date(body.dueAt) < now) {
        showStatus('Due time cannot be in the past!', 'error');
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
      showStatus('Rescheduled successfully!', 'success');
    } catch (e) {
      showStatus(e.message || "Reschedule failed!", 'error');
    }
  });

  const subBtn = document.getElementById("subscribeBtn");
  if (subBtn) subBtn.addEventListener("click", ensureSubscribed);

  // Sidebar nav elements
  const navAdd = document.getElementById('navAdd');
  const navAll = document.getElementById('navAll');
  const navUpcoming = document.getElementById('navUpcoming');
  const navActive = document.getElementById('navActive');
  const navCompleted = document.getElementById('navCompleted');
  function updateFilterUI() {
    // clear active state on sidebar navs
    if (navAll) navAll.classList.remove('active');
    if (navActive) navActive.classList.remove('active');
    if (navCompleted) navCompleted.classList.remove('active');
    if (navUpcoming) navUpcoming.classList.remove('active');
    if (currentFilter === 'all' && navAll) navAll.classList.add('active');
    if (currentFilter === 'active' && navActive) navActive.classList.add('active');
    if (currentFilter === 'done' && navCompleted) navCompleted.classList.add('active');
    if (currentFilter === 'upcoming' && navUpcoming) navUpcoming.classList.add('active');
  }
  updateFilterUI();

  // Wire sidebar nav to filters and actions
  if (navAdd) {
    navAdd.addEventListener('click', (e) => {
      e.preventDefault();
      // focus the content textarea for quick adding
      const content = document.getElementById('content');
      if (content) {
        content.focus();
      }
    });
  }
  if (navAll) navAll.addEventListener('click', (e) => { e.preventDefault(); currentFilter = 'all'; updateFilterUI(); loadTodos(); });
  if (navActive) navActive.addEventListener('click', (e) => { e.preventDefault(); currentFilter = 'active'; updateFilterUI(); loadTodos(); });
  if (navCompleted) navCompleted.addEventListener('click', (e) => { e.preventDefault(); currentFilter = 'done'; updateFilterUI(); loadTodos(); });
  if (navUpcoming) navUpcoming.addEventListener('click', (e) => { e.preventDefault(); currentFilter = 'upcoming'; updateFilterUI(); loadTodos(); });

  loadTodos();
});


