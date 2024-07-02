let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateTaskId() {
  let newId = nextId;
  nextId++;
  return newId;
}

function createTaskCard(task) {
  let taskCard = document.createElement("div");
  taskCard.classList.add("task-card");

  taskCard.innerHTML = `
      <div class="task-id">${task.id}</div>
      <div class="task-name">${task.name}</div>
      <div class="task-description">${task.description}</div>
      <div class="task-due-date">Due Date: ${task.dueDate}</div>
      <button class="delete-task-btn">Delete</button>
    `;

  document.getElementById("task-list").appendChild(taskCard);
}

function handleAddTask(event) {
  event.preventDefault();

  let taskName = document.getElementById("task-name-input").value;
  let taskDescription = document.getElementById("task-description-input").value;
  let dueDate = document.getElementById("due-date-input").value;

  let newTask = {
    id: generateTaskId(),
    name: taskName,
    description: taskDescription,
    dueDate: dueDate,
  };

  taskList.push(newTask);

  localStorage.setItem("tasks", JSON.stringify(taskList));

  createTaskCard(newTask);
}

function renderTaskList() {
  taskList.forEach((task) => {
    createTaskCard(task);
  });

  $(".task-card").draggable({
    revert: "invalid",
    cursor: "move",
    containment: "document",
    scroll: false,
  });

  $(".status-lane").droppable({
    drop: handleDrop,
  });
}

function handleDrop(event, ui) {
  let droppedTaskId = ui.draggable.find(".task-id").text();
  let newStatusLane = $(this).attr("id");

  let droppedTask = taskList.find((task) => task.id == droppedTaskId);

  droppedTask.status = newStatusLane;

  ui.draggable.appendTo($(this));
}

$("#add-task-button").on("click", function () {
  $("#formModal").modal("show");
});

$(document).ready(function () {
  renderTaskList();

  $("#add-task-form").submit(handleAddTask);

  $(".status-lane").droppable({
    drop: handleDrop,
  });

  $("#due-date-input").datepicker();
});
