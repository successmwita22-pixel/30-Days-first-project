// VARIABLE
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");
const clearCompleted = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter-btn");

// Edit modal variables
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const editSave = document.getElementById("editSave");
const editCancel = document.getElementById("editCancel");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let currentEditId = null;


// SAVE TASKS
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// DISPLAY TASKS
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    // Apply filter
    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }


    // Empty state

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    // Create task elements

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task");

        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

            </div>

            <div class="task-actions">

                <button
                    class="action-btn edit-btn"
                    onclick="editTask(${task.id})"
                    title="Edit task"
                >
                    ✎
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete task"
                >
                    ×
                </button>

            </div>

        `;

        taskList.appendChild(li);

    });


    updateTaskCount();

}

// ADD TASK
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = taskInput.value.trim();


    if (title === "") {

        alert("Please enter a task.");

        return;

    }


    const newTask = {

        id: Date.now(),

        title: title,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();


    // Clear input

    taskInput.value = "";

    taskInput.focus();

});

// TOGGLE TASK COMPLETION
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}

// EDIT TASK

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    currentEditId = id;
    editInput.value = task.title;
    editModal.style.display = "block";
    editInput.focus();

}

// DELETE TASK
function deleteTask(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmed) {

        return;

    }


    tasks = tasks.filter(task => task.id !== id);


    saveTasks();

    renderTasks();

}

// CLEAR COMPLETED
clearCompleted.addEventListener("click", function() {

    const completedTasks = tasks.filter(
        task => task.completed
    );


    if (completedTasks.length === 0) {

        alert("There are no completed tasks.");

        return;

    }


    const confirmed = confirm(
        "Remove all completed tasks?"
    );


    if (!confirmed) {

        return;

    }


    tasks = tasks.filter(
        task => !task.completed
    );


    saveTasks();

    renderTasks();

});

// FILTER TASKS
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        currentFilter = this.dataset.filter;


        renderTasks();

    });

});

// TASK COUNTER
function updateTaskCount() {

    const activeTasks = tasks.filter(
        task => !task.completed
    );
    taskCount.textContent = activeTasks.length;

}

// SECURITY
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

// EDIT MODAL EVENT HANDLERS
editSave.addEventListener("click", function() {

    if (currentEditId === null) return;

    const updatedTitle = editInput.value.trim();

    if (updatedTitle === "") {

        alert("Task cannot be empty.");

        return;

    }

    const task = tasks.find(task => task.id === currentEditId);

    if (task) {

        task.title = updatedTitle;

        saveTasks();

        renderTasks();

    }

    editModal.style.display = "none";

    currentEditId = null;

});

editCancel.addEventListener("click", function() {

    editModal.style.display = "none";

    currentEditId = null;

});

// Close modal when clicking outside of it
window.addEventListener("click", function(event) {

    if (event.target === editModal) {

        editModal.style.display = "none";

        currentEditId = null;

    }

});

// Allow Enter key to save
editInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {

        editSave.click();

    }

});

renderTasks();