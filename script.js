/* =========================
   GET ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderInput");
const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const recycleList = document.getElementById("recycleList");
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


/* =========================
   LOAD SAVED DATA
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


let deletedTasks =
    JSON.parse(
        localStorage.getItem("deletedTasks")
    ) || [];


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   SAVE DELETED TASKS
========================= */

function saveDeletedTasks() {

    localStorage.setItem(
        "deletedTasks",
        JSON.stringify(deletedTasks)
    );

}


/* =========================
   DISPLAY TASKS
========================= */

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
                function() {

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


/* =========================
   ADD TASK
========================= */

function addTask() {

    const taskText =
        taskInput.value.trim();


    if (taskText === "") {

        alert(
            "Please enter a task!"
        );

        return;

    }


    const newTask = {

        text:
            taskText,

        completed:
            false,

        reminder:
            reminderInput.value || null

    };


    tasks.push(
        newTask
    );


    saveTasks();


    displayTasks();

    displayReminders();


    taskInput.value = "";

    reminderInput.value = "";


    taskInput.focus();

}


/* =========================
   DISPLAY RECYCLE BIN
========================= */

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
                function() {

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


/* =========================
   EMPTY RECYCLE BIN
========================= */

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


/* =========================
   DISPLAY REMINDERS
========================= */

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


/* =========================
   SIDEBAR OPEN
========================= */

function openMenu() {

    sidebar.classList.add(
        "open"
    );

    overlay.classList.add(
        "show"
    );

}


/* =========================
   SIDEBAR CLOSE
========================= */

function closeMenu() {

    sidebar.classList.remove(
        "open"
    );

    overlay.classList.remove(
        "show"
    );

}


/* =========================
   OPEN MENU
========================= */

menuButton.addEventListener(
    "click",
    openMenu
);


/* =========================
   CLOSE MENU
========================= */

closeMenuButton.addEventListener(
    "click",
    closeMenu
);


/* =========================
   CLOSE WHEN CLICKING OUTSIDE
========================= */

overlay.addEventListener(
    "click",
    closeMenu
);


/* =========================
   CHANGE PAGES
========================= */

menuItems.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const pageId =
                    button.dataset.page;


                /* HIDE ALL PAGES */

                pages.forEach(
                    function(page) {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                /* SHOW SELECTED PAGE */

                const selectedPage =
                    document.getElementById(
                        pageId
                    );


                selectedPage.classList.add(
                    "active-page"
                );


                /* UPDATE ACTIVE MENU */

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


                /* CLOSE MENU */

                closeMenu();


                /* REFRESH DATA */

                displayTasks();

                displayRecycleBin();

                displayReminders();

            }
        );

    }
);


/* =========================
   ADD TASK BUTTON
========================= */

addButton.addEventListener(
    "click",
    addTask
);


/* =========================
   ENTER KEY
========================= */

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


/* =========================
   NOTIFICATIONS
========================= */

notificationButton.addEventListener(
    "click",
    async function() {

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

            notificationButton.textContent =
                "🔔 Notifications Enabled";

            alert(
                "Notifications are now enabled!"
            );

        } else {

            alert(
                "Notification permission was not granted."
            );

        }

    }
);


/* =========================
   CHECK REMINDERS
========================= */

function checkReminders() {

    const now =
        new Date();


    tasks.forEach(
        function(task) {

            if (
                !task.reminder
            ) {

                return;

            }


            const reminderTime =
                new Date(
                    task.reminder
                );


            const difference =
                Math.abs(
                    now.getTime() -
                    reminderTime.getTime()
                );


            /* Check within one minute */

            if (
                difference < 60000 &&
                !task.notified
            ) {

                if (
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

                }


                task.notified =
                    true;


                saveTasks();

            }

        }
    );

}


/* =========================
   CHECK EVERY 30 SECONDS
========================= */

setInterval(
    checkReminders,
    30000
);


/* =========================
   INITIAL LOAD
========================= */

displayTasks();

displayRecycleBin();

displayReminders();
