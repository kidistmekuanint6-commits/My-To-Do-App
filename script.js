const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");


// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }


        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Complete task
        taskText.addEventListener("click", function() {

            tasks[index].completed = !tasks[index].completed;

            saveTasks();

            displayTasks();

        });


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", function() {

            tasks.splice(index, 1);

            saveTasks();

            displayTasks();

        });


        li.appendChild(taskText);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });

}


// Add new task
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task!");

        return;

    }


    const newTask = {

        text: taskText,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    displayTasks();


    taskInput.value = "";

    taskInput.focus();

}


// Save tasks
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Add task when button is clicked
addButton.addEventListener("click", addTask);


// Add task when Enter is pressed
taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// Display saved tasks when app opens
displayTasks();