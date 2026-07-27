```javascript
/* =========================================================
   MY TO-DO APP — COMPLETE SCRIPT
   Frontend + Reminder Server Connection
========================================================= */


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL =
    "https://my-todo-reminder-server.onrender.com";


/* =========================================================
   GET ELEMENTS
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

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const menuButton =
    document.getElementById("menuButton");

const closeMenuButton =
    document.getElementById("closeMenuButton");

const menuItems =
    document.querySelectorAll(".menu-item");

const pages =
    document.querySelectorAll(".page");


/* =========================================================
   LOAD LOCAL DATA
========================================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


let deletedTasks =
    JSON.parse(
        localStorage.getItem("deletedTasks")
    ) || [];


/* =========================================================
   SAVE TASKS
========================================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================================
   SAVE DELETED TASKS
========================================================= */

function saveDeletedTasks() {

    localStorage.setItem(
        "deletedTasks",
        JSON.stringify(deletedTasks)
    );

}


/* =========================================================
   DISPLAY TASKS
========================================================= */

function displayTasks() {

    taskList.innerHTML = "";


    if (tasks.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";

    }


    tasks.forEach(
        function(task, index) {

            const li =
                document.createElement("li");

            li.className =
                "task";


            if (task.completed) {

                li.classList.add(
                    "completed"
                );

            }


            const taskText =
                document.createElement("span");

            taskText.className =
                "task-text";

            taskText.textContent =
                task.text;


            /* COMPLETE TASK */

            taskText.addEventListener(
                "click",
                function() {

                    tasks[index].completed =
                        !tasks[index].completed;

                    saveTasks();

                    displayTasks();

                }
            );


            /* DELETE BUTTON */

            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                async function() {

                    const deletedTask =
                        tasks.splice(
                            index,
                            1
                        )[0];


                    deletedTasks.push(
                        deletedTask
                    );


                    saveTasks();

                    saveDeletedTasks();


                    displayTasks();

                    displayRecycleBin();

                    displayReminders();


                    /*
                       If this task was connected
                       to the server, delete it there too.
                    */

                    if (
                        deletedTask.serverId
                    ) {

                        try {

                            await fetch(
                                SERVER_URL +
                                "/reminders/" +
                                deletedTask.serverId,
                                {
                                    method:
                                        "DELETE"
                                }
                            );

                            console.log(
                                "Reminder deleted from server."
                            );

                        } catch (error) {

                            console.log(
                                "Could not delete reminder from server:",
                                error
                            );

                        }

                    }

                }
            );


            li.appendChild(
                taskText
            );


            li.appendChild(
                deleteButton
            );


            taskList.appendChild(
                li
            );

        }
    );

}


/* =========================================================
   ADD TASK
========================================================= */

async function addTask() {

    const taskText =
        taskInput.value.trim();


    const reminderTime =
        reminderInput.value;


    /* CHECK TASK */

    if (
        taskText === ""
    ) {

        alert(
            "Please enter a task!"
        );

        return;

    }


    /* CREATE TASK */

    const newTask = {

        text:
            taskText,

        completed:
            false,

        reminder:
            reminderTime || null,

        notified:
            false,

        serverId:
            null

    };


    /*
       IF A REMINDER WAS SELECTED,
       SEND IT TO THE SERVER
    */

    if (
        reminderTime
    ) {

        try {

            console.log(
                "Sending reminder to server..."
            );


            const response =
                await fetch(
                    SERVER_URL +
                    "/reminders",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                text:
                                    taskText,

                                reminder:
                                    reminderTime,

                                completed:
                                    false

                            })

                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Server returned an error."
                );

            }


            const data =
                await response.json();


            console.log(
                "Reminder successfully saved on server:",
                data
            );


            /*
               SAVE SERVER ID
            */

            newTask.serverId =
                data.reminder.id;


        } catch (error) {

            console.error(
                "Could not connect to reminder server:",
                error
            );


            alert(
                "The reminder could not be connected to the server.\n\n" +
                "Make sure your Node.js reminder server is running."
            );

        }

    }


    /* SAVE TASK LOCALLY */

    tasks.push(
        newTask
    );


    saveTasks();


    /* REFRESH APP */

    displayTasks();

    displayReminders();


    /* CLEAR INPUTS */

    taskInput.value = "";

    reminderInput.value = "";


    taskInput.focus();

}


/* =========================================================
   DISPLAY RECYCLE BIN
========================================================= */

function displayRecycleBin() {

    recycleList.innerHTML = "";


    if (
        deletedTasks.length === 0
    ) {

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


    deletedTasks.forEach(
        function(task, index) {

            const li =
                document.createElement("li");

            li.className =
                "deleted-task";


            const text =
                document.createElement("span");

            text.textContent =
                task.text;


            /* RESTORE */

            const restoreButton =
                document.createElement("button");

            restoreButton.textContent =
                "Restore";


            restoreButton.addEventListener(
                "click",
                async function() {

                    tasks.push(
                        task
                    );


                    deletedTasks.splice(
                        index,
                        1
                    );


                    saveTasks();

                    saveDeletedTasks();


                    displayTasks();

                    displayRecycleBin();

                    displayReminders();

                }
            );


            /* DELETE FOREVER */

            const deleteForeverButton =
                document.createElement("button");

            deleteForeverButton.textContent =
                "Delete Forever";


            deleteForeverButton.addEventListener(
                "click",
                function() {

                    deletedTasks.splice(
                        index,
                        1
                    );


                    saveDeletedTasks();


                    displayRecycleBin();

                }
            );


            li.appendChild(
                text
            );


            li.appendChild(
                restoreButton
            );


            li.appendChild(
                deleteForeverButton
            );


            recycleList.appendChild(
                li
            );

        }
    );

}


/* =========================================================
   EMPTY RECYCLE BIN
========================================================= */

emptyRecycleButton.addEventListener(
    "click",
    function() {

        if (
            deletedTasks.length === 0
        ) {

            return;

        }


        const confirmDelete =
            confirm(
                "Are you sure you want to permanently delete everything in the Recycle Bin?"
            );


        if (
            confirmDelete
        ) {

            deletedTasks = [];


            saveDeletedTasks();


            displayRecycleBin();

        }

    }
);


/* =========================================================
   DISPLAY REMINDERS
========================================================= */

function displayReminders() {

    reminderList.innerHTML = "";


    const reminders =
        tasks.filter(
            function(task) {

                return task.reminder;

            }
        );


    if (
        reminders.length === 0
    ) {

        emptyReminderMessage.style.display =
            "block";

        return;

    }


    emptyReminderMessage.style.display =
        "none";


    reminders.forEach(
        function(task) {

            const card =
                document.createElement("div");

            card.className =
                "reminder-card";


            const title =
                document.createElement("strong");

            title.textContent =
                "⏰ " + task.text;


            const time =
                document.createElement("small");


            const date =
                new Date(
                    task.reminder
                );


            time.textContent =
                date.toLocaleString();


            card.appendChild(
                title
            );


            card.appendChild(
                time
            );


            reminderList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SIDEBAR
========================================================= */

function openMenu() {

    sidebar.classList.add(
        "open"
    );

    overlay.classList.add(
        "show"
    );

}


function closeMenu() {

    sidebar.classList.remove(
        "open"
    );

    overlay.classList.remove(
        "show"
    );

}


menuButton.addEventListener(
    "click",
    openMenu
);


closeMenuButton.addEventListener(
    "click",
    closeMenu
);


overlay.addEventListener(
    "click",
    closeMenu
);


/* =========================================================
   CHANGE PAGES
========================================================= */

menuItems.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const pageId =
                    button.dataset.page;


                pages.forEach(
                    function(page) {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                const selectedPage =
                    document.getElementById(
                        pageId
                    );


                selectedPage.classList.add(
                    "active-page"
                );


                menuItems.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                closeMenu();


                displayTasks();

                displayRecycleBin();

                displayReminders();

            }
        );

    }
);


/* =========================================================
   ADD TASK BUTTON
========================================================= */

addButton.addEventListener(
    "click",
    addTask
);


/* =========================================================
   ENTER KEY
========================================================= */

taskInput.addEventListener(
    "keypress",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            addTask();

        }

    }
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

async function enableNotifications() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Notifications are not supported on this device."
        );

        return;

    }


    const permission =
        await Notification.requestPermission();


    if (
        permission === "granted"
    ) {

        localStorage.setItem(
            "notificationsEnabled",
            "true"
        );


        notificationButton.textContent =
            "🔔 Notifications Enabled";


        alert(
            "Notifications are now enabled!"
        );

    } else {

        localStorage.setItem(
            "notificationsEnabled",
            "false"
        );


        alert(
            "Notification permission was not granted."
        );

    }

}


notificationButton.addEventListener(
    "click",
    enableNotifications
);


/* =========================================================
   DARK MODE
========================================================= */

function updateDarkModeButton() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        ) === "true";


    if (
        darkMode
    ) {

        darkModeButton.textContent =
            "☀️ Disable Dark Mode";

    } else {

        darkModeButton.textContent =
            "🌙 Enable Dark Mode";

    }

}


darkModeButton.addEventListener(
    "click",
    function() {

        const darkMode =
            document.body.classList.toggle(
                "dark-mode"
            );


        localStorage.setItem(
            "darkMode",
            darkMode
        );


        updateDarkModeButton();

    }
);


function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        ) === "true";


    if (
        darkMode
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }


    updateDarkModeButton();

}


/* =========================================================
   CLEAR ALL TASKS
========================================================= */

clearTasksButton.addEventListener(
    "click",
    function() {

        if (
            tasks.length === 0
        ) {

            alert(
                "You don't have any tasks to clear."
            );

            return;

        }


        const confirmClear =
            confirm(
                "Are you sure you want to permanently delete ALL your tasks? This cannot be undone."
            );


        if (
            confirmClear
        ) {

            tasks = [];


            saveTasks();


            displayTasks();

            displayReminders();


            alert(
                "All tasks have been cleared."
            );

        }

    }
);


/* =========================================================
   LOCAL REMINDER CHECK
========================================================= */

function checkReminders() {

    const now =
        new Date();


    let tasksChanged =
        false;


    tasks.forEach(
        function(task) {

            if (
                !task.reminder
            ) {

                return;

            }


            if (
                task.notified
            ) {

                return;

            }


            const reminderTime =
                new Date(
                    task.reminder
                );


            if (
                now >= reminderTime
            ) {

                if (
                    "Notification" in window &&
                    Notification.permission ===
                    "granted"
                ) {

                    new Notification(
                        "⏰ Task Reminder",
                        {

                            body:
                                task.text

                        }
                    );

                } else {

                    alert(
                        "⏰ Reminder!\n\n" +
                        task.text
                    );

                }


                task.notified =
                    true;


                tasksChanged =
                    true;

            }

        }
    );


    if (
        tasksChanged
    ) {

        saveTasks();

        displayTasks();

        displayReminders();

    }

}


/* =========================================================
   CHECK LOCAL REMINDERS
========================================================= */

setInterval(
    checkReminders,
    5000
);


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettings() {

    const notificationsEnabled =
        localStorage.getItem(
            "notificationsEnabled"
        ) === "true";


    if (
        notificationsEnabled &&
        "Notification" in window &&
        Notification.permission ===
        "granted"
    ) {

        notificationButton.textContent =
            "🔔 Notifications Enabled";

    }


    loadDarkMode();

}


/* =========================================================
   INITIAL LOAD
========================================================= */

displayTasks();

displayRecycleBin();

displayReminders();

loadSettings();

checkReminders();


/* =========================================================
   TEST SERVER CONNECTION
========================================================= */

async function testServerConnection() {

    try {

        const response =
            await fetch(
                SERVER_URL
            );


        const data =
            await response.json();


        console.log(
            "✅ Reminder server connected:",
            data
        );


    } catch (error) {

        console.error(
            "❌ Reminder server connection failed:",
            error
        );

    }

}


testServerConnection();
```
