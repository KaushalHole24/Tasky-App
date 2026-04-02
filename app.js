let addBtn = document.querySelector(".addBtn");
let newTask = document.querySelector(".taskInput");
let taskCon = document.querySelector(".task-container");
let circle = document.querySelector(".progress-circle");
let progressText = document.querySelector("#percentText");
let currentPercent = 0;
let filterbtns = document.querySelectorAll(".filterBtn");
let currentFilter = "all";

let ul = document.createElement("ul");
taskCon.appendChild(ul);

function filterTask(filterType) {

    let allTasks = document.querySelectorAll(".task");

    allTasks.forEach((task) => {
        let check = task.querySelector(".taskCompleted");

        if (filterType === "all") {
            task.style.display = "flex";
        } else if (filterType === "completed") {
            if (check.checked) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        } else if (filterType === "pending") {
            if (!check.checked) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        }

    });


}

filterbtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {

        let filterType = event.target.dataset.filter;

        filterbtns.forEach(btn => btn.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = filterType;
        filterTask(currentFilter);

    });
})



function updateCount() {
    let totalTasks = document.querySelector("#totalTasks");
    let totalTasksCount = document.querySelectorAll(".task").length;
    totalTasks.innerText = totalTasksCount;

    let completedTasks = document.querySelector("#completedTasks");
    let completedTasksCount = document.querySelectorAll(".taskCompleted:checked").length;
    completedTasks.innerText = completedTasksCount;

    let remainingTasks = document.querySelector("#remainingTasks");
    let remainingTasksCount = totalTasksCount - completedTasksCount;
    remainingTasks.innerText = remainingTasksCount;

}

// Function to Check if any task exist

function checkEmptyState() {
    let tasks = document.querySelectorAll(".task");

    if (tasks.length === 0) {
        emptyMsg.classList.add("show");
    } else {
        emptyMsg.classList.remove("show");
    }
}

// Function to save data in localStorage

function saveTasks() {
    let tasks = [];

    document.querySelectorAll(".task").forEach((task) => {
        let text = task.querySelector(".taskText").innerText;
        let completed = task.querySelector(".taskCompleted").checked;

        tasks.push({
            text: text,
            completed: completed
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to update progress

function updateProgress() {
    let checkboxes = document.querySelectorAll(".taskCompleted");
    let total = checkboxes.length;
    let checked = document.querySelectorAll(".taskCompleted:checked").length;
    let targetPercent = total == 0 ? 0 : Math.round((checked / total) * 100);

    let duration = 400;
    let startTime = performance.now();
    let startPercent = currentPercent;

    function animate(currentTime) {
        let elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);

        let easeProgress = 1 - Math.pow(1 - progress, 3);

        currentPercent = startPercent + (targetPercent - startPercent) * easeProgress;

        circle.style.setProperty('--percent', `${currentPercent}%`);
        progressText.textContent = `${Math.round(currentPercent)}%`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

// Function to load previous task on page after refresh 

function loadTask() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach((task) => {
        let li = document.createElement("li");
        li.classList.add("task");

        let checkbtn = document.createElement("input");
        checkbtn.type = "checkbox";
        checkbtn.classList.add("taskCompleted");
        checkbtn.checked = task.completed;

        let taskText = document.createElement("span");
        taskText.classList.add("taskText");
        taskText.innerText = task.text;

        let editbtn = document.createElement("button");
        editbtn.classList.add("editbtn");
        editbtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

        let delbtn = document.createElement("button");
        delbtn.classList.add("delbtn");
        delbtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

        li.appendChild(checkbtn);
        li.appendChild(taskText);
        li.appendChild(editbtn);
        li.appendChild(delbtn);

        ul.appendChild(li);
    });

    updateCount();
    updateProgress();
    checkEmptyState();
}

// Add task butoon event listner 

addBtn.addEventListener("click", () => {
    let taskValue = newTask.value.trim();

    if (taskValue === "") return;

    let li = document.createElement("li");
    li.classList.add("task");

    let checkbtn = document.createElement("input");
    checkbtn.type = "checkbox";
    checkbtn.classList.add("taskCompleted");

    let taskText = document.createElement("span");
    taskText.classList.add("taskText");
    taskText.innerText = taskValue;

    let editbtn = document.createElement("button");
    editbtn.classList.add("editbtn");
    editbtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

    let delbtn = document.createElement("button");
    delbtn.classList.add("delbtn");
    delbtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    li.appendChild(checkbtn);
    li.appendChild(taskText);
    li.appendChild(editbtn);
    li.appendChild(delbtn);

    ul.appendChild(li);
    newTask.value = "";

    saveTasks();
    updateProgress();
    updateCount();
    filterTask(currentFilter);
    checkEmptyState();
});

// Delete button event listner 

ul.addEventListener("click", (event) => {
    let deletebtn = event.target.closest(".delbtn");
    if (deletebtn) {
        deletebtn.closest(".task").remove();
        saveTasks();
        updateProgress();
        updateCount();
        filterTask(currentFilter);
        checkEmptyState();
    }

    let editbtn = event.target.closest(".editbtn");
    if (editbtn) {
        let taskItem = editbtn.closest(".task");
        let taskText = taskItem.querySelector(".taskText");

        if (!editbtn.classList.contains("editing")) {

            taskText.setAttribute("contenteditable", "true");
            taskText.focus();

            editbtn.classList.add("editing");

            // change icon to SAVE
            editbtn.innerHTML = '<i class="fa-solid fa-check"></i>';

        } else {

            let updatedText = taskText.innerText.trim();

            if (updatedText === "") {
                taskText.innerText = "Untitled Task";
            }

            taskText.setAttribute("contenteditable", "false");
            editbtn.classList.remove("editing");

            // change icon back to EDIT
            editbtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

            saveTasks();
        }
    }
});

// checkbox event listener

ul.addEventListener("change", (event) => {
    if (event.target.classList.contains("taskCompleted")) {
        saveTasks();
        updateCount();
        filterTask(currentFilter);
        updateProgress();
    }
});

// function to add task on enter button click

newTask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addBtn.click();
    }
});

// empty string if their are 0 task 

let emptyMsg = document.createElement("p");
emptyMsg.classList.add("emptyMsg");
emptyMsg.innerText = "No tasks yet. Add one!";
taskCon.appendChild(emptyMsg);

loadTask();