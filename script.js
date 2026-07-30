/* =========================================================
MY TO-DO APP - FRONTEND JAVASCRIPT
========================================================= */

/* =========================================================
SERVER URL
========================================================= */

const SERVER_URL = "https://my-todo-reminder-server.onrender.com";

/* =========================================================
VAPID PUBLIC KEY
========================================================= */

const VAPID_PUBLIC_KEY =
"BD-RtRMXFPHwxdOXyV5U9DymQBTDLJSP1M9vispNiaY1ZDXBYI6kkuig3cg-uZ1TqB-L0DTLGcI-T1EPP5ceNfc";
"BD-RtRMXFPHwxdOXyV5U9DymQBTDLJSP1M9vispNiaY1ZDXBYI6kkuig3cg-uZ1TqB-L0DTLGcI-T1EPP5ceNfc";

/* =========================================================
APP DATA
========================================================= */

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let deletedTasks =
JSON.parse(localStorage.getItem("deletedTasks")) || [];

/* =========================================================
GET HTML ELEMENTS
========================================================= */

const taskInput =
document.getElementById("taskInput");

const reminderInput =
document.getElementById("reminderInput");

const addButton =
document.getElementById("addButton");

const taskList =
document.getElementById("taskList");

const emptyMessage =
document.getElementById("emptyMessage");

const recycleList =
document.getElementById("recycleList");

const emptyRecycleMessage =
document.getElementById("emptyRecycleMessage");

const emptyRecycleButton =
document.getElementById("emptyRecycleButton");

const reminderList =
document.getElementById("reminderList");

const emptyReminderMessage =
document.getElementById("emptyReminderMessage");

const notificationButton =
document.getElementById("notificationButton");

const darkModeButton =
document.getElementById("darkModeButton");

const clearTasksButton =
document.getElementById("clearTasksButton");

const menuButton =
document.getElementById("menuButton");

const closeMenuButton =
document.getElementById("closeMenuButton");

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

const menuItems =
document.querySelectorAll(".menu-item");

const pages =
document.querySelectorAll(".page");

/* =========================================================
SAVE LOCAL DATA
========================================================= */

function saveTasks() {

```
localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
);
```

}

function saveDeletedTasks() {

```
localStorage.setItem(
    "deletedTasks",
    JSON.stringify(deletedTasks)
);
```

}

/* =========================================================
DISPLAY TASKS
========================================================= */

function renderTasks() {

```
taskList.innerHTML = "";

if (tasks.length === 0) {

    emptyMessage.style.display = "block";

    return;

}

emptyMessage.style.display = "none";

tasks.forEach(function(task) {

    const li =
        document.createElement("li");

    li.className = "task";

    if (task.completed) {

        li.classList.add("completed");

    }

    const taskText =
        document.createElement("span");

    taskText.className = "task-text";

    taskText.textContent = task.text;

    taskText.addEventListener(
        "click",
        function() {

            task.completed =
                !task.completed;

            saveTasks();

            renderTasks();

        }
    );

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-button";

    deleteButton.textContent =
        "Delete";

    deleteButton.addEventListener(
        "click",
        function() {

            deleteTask(task.id);

        }
    );

    li.appendChild(taskText);

    li.appendChild(deleteButton);

    taskList.appendChild(li);

});
```

}

/* =========================================================
ADD NEW TASK AND REMINDER
========================================================= */

async function addTask() {

```
const text =
    taskInput.value.trim();

const reminder =
    reminderInput.value;

if (!text) {

    alert(
        "Please write a task first. 🌸"
    );

    return;

}

/* CREATE LOCAL TASK */

const newTask = {

    id: Date.now(),

    text: text,

    completed: false

};

tasks.push(newTask);

saveTasks();

renderTasks();

taskInput.value = "";

/* CREATE REMINDER */

if (reminder) {

    try {

        const reminderDate =
            new Date(reminder);

        const response =
            await fetch(
                SERVER_URL + "/reminders",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            text: text,

                            date:
                                reminderDate
                                .toISOString()
                                .split("T")[0],

                            time:
                                reminderDate
                                .toTimeString()
                                .slice(0, 5),

                            completed: false

                        })

                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to create reminder."
            );

        }

        console.log(
            "⏰ Reminder created successfully."
        );

        reminderInput.value = "";

        loadReminders();

    } catch (error) {

        console.error(
            "Reminder error:",
            error
        );

        alert(
            "Task was added, but the reminder could not be saved."
        );

    }

}
```

}

/* =========================================================
DELETE TASK
========================================================= */

function deleteTask(taskId) {

```
const task =
    tasks.find(function(item) {

        return item.id === taskId;

    });

if (!task) {

    return;

}

deletedTasks.push(task);

tasks =
    tasks.filter(function(item) {

        return item.id !== taskId;

    });

saveTasks();

saveDeletedTasks();

renderTasks();

renderRecycleBin();
```

}

/* =========================================================
DISPLAY RECYCLE BIN
========================================================= */

function renderRecycleBin() {

```
recycleList.innerHTML = "";

if (deletedTasks.length === 0) {

    emptyRecycleMessage.style.display =
        "block";

    emptyRecycleButton.style.display =
        "none";

    return;

}

emptyRecycleMessage.style.display =
    "none";

emptyRecycleButton.style.display =
    "block";

deletedTasks.forEach(function(task) {

    const li =
        document.createElement("li");

    li.className =
        "deleted-task";

    const text =
        document.createElement("span");

    text.textContent =
        task.text;

    const restoreButton =
        document.createElement("button");

    restoreButton.textContent =
        "Restore";

    restoreButton.addEventListener(
        "click",
        function() {

            restoreTask(task.id);

        }
    );

    const deleteForeverButton =
        document.createElement("button");

    deleteForeverButton.textContent =
        "Delete Forever";

    deleteForeverButton.addEventListener(
        "click",
        function() {

            deleteForever(task.id);

        }
    );

    li.appendChild(text);

    li.appendChild(restoreButton);

    li.appendChild(deleteForeverButton);

    recycleList.appendChild(li);

});
```

}

/* =========================================================
RESTORE TASK
========================================================= */

function restoreTask(taskId) {

```
const task =
    deletedTasks.find(function(item) {

        return item.id === taskId;

    });

if (!task) {

    return;

}

tasks.push(task);

deletedTasks =
    deletedTasks.filter(function(item) {

        return item.id !== taskId;

    });

saveTasks();

saveDeletedTasks();

renderTasks();

renderRecycleBin();
```

}

/* =========================================================
DELETE TASK FOREVER
========================================================= */

function deleteForever(taskId) {

```
deletedTasks =
    deletedTasks.filter(function(item) {

        return item.id !== taskId;

    });

saveDeletedTasks();

renderRecycleBin();
```

}

/* =========================================================
EMPTY RECYCLE BIN
========================================================= */

function emptyRecycleBin() {

```
if (deletedTasks.length === 0) {

    return;

}

const confirmed =
    confirm(
        "Delete everything in the Recycle Bin permanently?"
    );

if (!confirmed) {

    return;

}

deletedTasks = [];

saveDeletedTasks();

renderRecycleBin();
```

}

/* =========================================================
LOAD REMINDERS
========================================================= */

async function loadReminders() {

```
try {

    const response =
        await fetch(
            SERVER_URL + "/reminders"
        );

    if (!response.ok) {

        throw new Error(
            "Could not load reminders."
        );

    }

    const reminders =
        await response.json();

    renderReminders(reminders);

} catch (error) {

    console.error(
        "Could not load reminders:",
        error
    );

}
```

}

/* =========================================================
DISPLAY REMINDERS
========================================================= */

function renderReminders(reminders) {

```
reminderList.innerHTML = "";

if (reminders.length === 0) {

    emptyReminderMessage.style.display =
        "block";

    return;

}

emptyReminderMessage.style.display =
    "none";

reminders.forEach(function(reminder) {

    const card =
        document.createElement("div");

    card.className =
        "reminder-card";

    const title =
        document.createElement("strong");

    title.textContent =
        reminder.text;

    const date =
        document.createElement("small");

    date.textContent =
        "⏰ " +
        (reminder.date || "") +
        " " +
        (reminder.time || "");

    card.appendChild(title);

    card.appendChild(date);

    reminderList.appendChild(card);

});
```

}

/* =========================================================
CONVERT BASE64 TO UINT8ARRAY
========================================================= */

function urlBase64ToUint8Array(
base64String
) {

```
const padding =
    "=".repeat(
        (4 -
            base64String.length % 4) % 4
    );

const base64 =
    (
        base64String +
        padding
    )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

const rawData =
    window.atob(base64);

const outputArray =
    new Uint8Array(
        rawData.length
    );

for (
    let i = 0;
    i < rawData.length;
    ++i
) {

    outputArray[i] =
        rawData.charCodeAt(i);

}

return outputArray;
```

}

/* =========================================================
ENABLE WEB PUSH NOTIFICATIONS
========================================================= */

async function enableNotifications() {

```
try {

    if (!("Notification" in window)) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }

    if (!("serviceWorker" in navigator)) {

        alert(
            "Your browser does not support Service Workers."
        );

        return;

    }

    if (!("PushManager" in window)) {

        alert(
            "Your browser does not support Push Notifications."
        );

        return;

    }

    const permission =
        await Notification.requestPermission();

    if (permission !== "granted") {

        alert(
            "Notification permission was not granted."
        );

        return;

    }

    const registration =
        await navigator.serviceWorker.ready;

    let subscription =
        await registration.pushManager
            .getSubscription();

    if (!subscription) {

        subscription =
            await registration.pushManager
                .subscribe({

                    userVisibleOnly: true,

                    applicationServerKey:
                        urlBase64ToUint8Array(
                            VAPID_PUBLIC_KEY
                        )

                });

    }

    const response =
        await fetch(
            SERVER_URL + "/subscribe",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        subscription
                    )

            }
        );

    if (!response.ok) {

        throw new Error(
            "Could not save push subscription."
        );

    }

    notificationButton.textContent =
        "✅ Notifications Enabled";

    alert(
        "Notifications are enabled! 🔔"
    );

    console.log(
        "🔔 Push subscription saved successfully."
    );

} catch (error) {

    console.error(
        "Notification setup failed:",
        error
    );

    alert(
        "Could not enable notifications. Check the browser console for details."
    );

}
```

}

/* =========================================================
DARK MODE
========================================================= */

function toggleDarkMode() {

```
document.body.classList.toggle(
    "dark-mode"
);

const darkModeEnabled =
    document.body.classList.contains(
        "dark-mode"
    );

localStorage.setItem(
    "darkMode",
    darkModeEnabled
);

if (darkModeEnabled) {

    darkModeButton.textContent =
        "☀️ Disable Dark Mode";

} else {

    darkModeButton.textContent =
        "🌙 Enable Dark Mode";

}
```

}

/* =========================================================
LOAD DARK MODE
========================================================= */

function loadDarkMode() {

```
const darkModeEnabled =
    localStorage.getItem(
        "darkMode"
    ) === "true";

if (darkModeEnabled) {

    document.body.classList.add(
        "dark-mode"
    );

    darkModeButton.textContent =
        "☀️ Disable Dark Mode";

}
```

}

/* =========================================================
CLEAR ALL TASKS
========================================================= */

function clearAllTasks() {

```
if (tasks.length === 0) {

    alert(
        "You don't have any tasks to clear."
    );

    return;

}

const confirmed =
    confirm(
        "Are you sure you want to delete all your tasks?"
    );

if (!confirmed) {

    return;

}

deletedTasks =
    deletedTasks.concat(tasks);

tasks = [];

saveTasks();

saveDeletedTasks();

renderTasks();

renderRecycleBin();
```

}

/* =========================================================
SIDEBAR
========================================================= */

function openSidebar() {

```
sidebar.classList.add("open");

overlay.classList.add("show");
```

}

function closeSidebar() {

```
sidebar.classList.remove("open");

overlay.classList.remove("show");
```

}

/* =========================================================
PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

```
pages.forEach(function(page) {

    page.classList.remove(
        "active-page"
    );

});

const selectedPage =
    document.getElementById(pageId);

if (selectedPage) {

    selectedPage.classList.add(
        "active-page"
    );

}

menuItems.forEach(function(item) {

    item.classList.remove("active");

    if (
        item.dataset.page === pageId
    ) {

        item.classList.add("active");

    }

});

closeSidebar();

if (
    pageId === "remindersPage"
) {

    loadReminders();

}
```

}

/* =========================================================
EVENT LISTENERS
========================================================= */

addButton.addEventListener(
"click",
addTask
);

taskInput.addEventListener(
"keydown",
function(event) {

```
    if (event.key === "Enter") {

        addTask();

    }

}
```

);

emptyRecycleButton.addEventListener(
"click",
emptyRecycleBin
);

notificationButton.addEventListener(
"click",
enableNotifications
);

darkModeButton.addEventListener(
"click",
toggleDarkMode
);

clearTasksButton.addEventListener(
"click",
clearAllTasks
);

menuButton.addEventListener(
"click",
openSidebar
);

closeMenuButton.addEventListener(
"click",
closeSidebar
);

overlay.addEventListener(
"click",
closeSidebar
);

menuItems.forEach(function(item) {

```
item.addEventListener(
    "click",
    function() {

        showPage(
            item.dataset.page
        );

    }
);
```

});

/* =========================================================
START APP
========================================================= */

renderTasks();

renderRecycleBin();

loadReminders();

loadDarkMode();

console.log(
"🌸 My To-Do App is ready!"
);
