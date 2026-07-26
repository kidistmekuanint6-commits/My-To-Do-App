// ================================
// GET HTML ELEMENTS
// ================================

const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderInput");
const addButton = document.getElementById("addButton");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const recycleList = document.getElementById("recycleList");
const emptyRecycleMessage = document.getElementById(
    "emptyRecycleMessage"
);

const emptyRecycleButton = document.getElementById(
    "emptyRecycleButton"
);

const notificationButton = document.getElementById(
    "notificationButton"
);


// ================================
// LOAD SAVED DATA
// ================================

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

let deletedTasks = JSON.parse(
    localStorage.getItem("deletedTasks")
) || [];


// ================================
// SAVE TASKS
// ================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ================================
// SAVE DELETED TASKS
// ================================

function saveDeletedTasks() {

    localStorage.setItem(
        "deletedTasks",
        JSON.stringify(deletedTasks)
    );

}


// ================================
// DISPLAY ACTIVE TASKS
// ================================

function displayTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    tasks.forEach(function(task, index) {

        const li = document.createElement("li");

        li.className = "task";


        if (task.completed) {

            li.classList.add("completed");

        }


        // Task text

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Complete task

        taskText.addEventListener(
            "click",
            function() {

                tasks[index].completed =
                    !tasks[index].completed;

                saveTasks();

                displayTasks();

            }
        );


        // Reminder display

        if (task.reminder) {

            const reminderText =
                document.createElement("small");

            const reminderDate =
                new Date(task.reminder);

            reminderText.textContent =
                " ⏰ " +
                reminderDate.toLocaleString();

            li.appendChild(reminderText);

        }


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-button";

        deleteButton.textContent =
            "🗑️ Delete";


        deleteButton.addEventListener(
            "click",
            function() {

                // Move task to Recycle Bin

                const deletedTask = tasks[index];

                deletedTask.deletedAt =
                    new Date().toISOString();

                deletedTasks.push(deletedTask);

                // Remove from active tasks

                tasks.splice(index, 1);

                saveTasks();

                saveDeletedTasks();

                displayTasks();

                displayRecycleBin();

            }
        );


        li.appendChild(taskText);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });

}


// ================================
// DISPLAY RECYCLE BIN
// ================================

function displayRecycleBin() {

    recycleList.innerHTML = "";


    if (deletedTasks.length === 0) {

        emptyRecycleMessage.style.display =
            "block";

        emptyRecycleButton.style.display =
            "none";

    } else {

        emptyRecycleMessage.style.display =
            "none";

        emptyRecycleButton.style.display =
            "block";

    }


    deletedTasks.forEach(
        function(task, index) {

            const li =
                document.createElement("li");

            li.className =
                "deleted-task";


            const taskText =
                document.createElement("span");

            taskText.textContent =
                task.text;


            // Restore button

            const restoreButton =
                document.createElement("button");

            restoreButton.textContent =
                "♻️ Restore";


            restoreButton.addEventListener(
                "click",
                function() {

                    tasks.push(task);

                    deletedTasks.splice(
                        index,
                        1
                    );

                    saveTasks();

                    saveDeletedTasks();

                    displayTasks();

                    displayRecycleBin();

                }
            );


            // Permanently delete

            const permanentDeleteButton =
                document.createElement("button");

            permanentDeleteButton.textContent =
                "❌ Delete Forever";


            permanentDeleteButton.addEventListener(
                "click",
                function() {

                    const confirmDelete =
                        confirm(
                            "Delete this task permanently?"
                        );


                    if (confirmDelete) {

                        deletedTasks.splice(
                            index,
                            1
                        );

                        saveDeletedTasks();

                        displayRecycleBin();

                    }

                }
            );


            li.appendChild(taskText);

            li.appendChild(
                restoreButton
            );

            li.appendChild(
                permanentDeleteButton
            );

            recycleList.appendChild(li);

        }
    );

}


// ================================
// ADD NEW TASK
// ================================

function addTask() {

    const taskText =
        taskInput.value.trim();

    const reminder =
        reminderInput.value;


    if (taskText === "") {

        alert(
            "Please enter a task!"
        );

        return;

    }


    const newTask = {

        text: taskText,

        completed: false,

        reminder:
            reminder || null

    };


    tasks.push(newTask);

    saveTasks();

    displayTasks();


    // Clear inputs

    taskInput.value = "";

    reminderInput.value = "";

    taskInput.focus();

}


// ================================
// EMPTY RECYCLE BIN
// ================================

emptyRecycleButton.addEventListener(
    "click",
    function() {

        if (deletedTasks.length === 0) {

            return;

        }


        const confirmEmpty =
            confirm(
                "Permanently delete everything in the Recycle Bin?"
            );


        if (confirmEmpty) {

            deletedTasks = [];

            saveDeletedTasks();

            displayRecycleBin();

        }

    }
);


// ================================
// NOTIFICATION PERMISSION
// ================================

notificationButton.addEventListener(
    "click",
    async function() {

        if (
            "Notification"
            in window
        ) {

            const permission =
                await Notification.requestPermission();


            if (
                permission === "granted"
            ) {

                alert(
                    "Notifications are enabled! 🔔"
                );

            } else {

                alert(
                    "Notification permission was not granted."
                );

            }

        } else {

            alert(
                "Notifications are not supported by this browser."
            );

        }

    }
);


// ================================
// ADD TASK BUTTON
// ================================

addButton.addEventListener(
    "click",
    addTask
);


// ================================
// ENTER KEY
// ================================

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


// ================================
// START APP
// ================================

displayTasks();

displayRecycleBin();