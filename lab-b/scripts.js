//Niedokladnie przeczytalem instrukcje i na poczatku zrobilem obsluge zdarzen bez
// przechowyniana zadan w tablicy javascript. Operacej wykonywalem bezposrednio na elementach html
//Nastepnie za pomoca Chatgpt przebudowalem kod tak aby zadania byly przechowywane w tablicy javascript
// i dopiero aktualizowane na stronie za pomoca funckji draw
let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    name: "Task1",
    date: "2026-12-20",
    completed: false
  },
  {
    name: "Task2",
    date: "2026-12-21",
    completed: false
  }
];
let searchTerm = "";
const form =document.getElementById("taskForm"); //obslugianie formularza
const taskContainer = document.getElementById("taskContainer"); // glowny kontener

const taskInput = document.getElementById("value"); // input do nazwy zadania

const dateInput = document.getElementById("date"); // input do daty zadania

const searchInput = document.getElementById("search");
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function draw() {

  taskContainer.innerHTML = "";

  tasks.forEach(function(taskData, index) {

    if (searchTerm.length >= 2 &&
      !taskData.name.toLowerCase().includes(searchTerm)) {
      return;

    }
    const task = document.createElement("div");
    task.className = "task";
    task.dataset.index = index; // tworzymy wlasny atrybut data-index

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskData.completed;
    const name = document.createElement("span");
    name.className = "taskName";
    if (searchTerm.length >= 2) {
      const position = taskData.name.toLowerCase().indexOf(searchTerm);
      const before = taskData.name.slice(0, position);
      const match = taskData.name.slice(position, position + searchTerm.length);
      const after = taskData.name.slice(position + searchTerm.length);
      name.appendChild(document.createTextNode(before));
      const highlight = document.createElement("mark");

      highlight.textContent = match;
      name.appendChild(highlight);
      name.appendChild(document.createTextNode(after));

    } else {
      name.textContent = taskData.name;
    }

    const date = document.createElement("span");
    date.className = "taskDate";
    date.textContent = taskData.date;
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "deleteButton";
    deleteButton.textContent = "Usuń";

    task.appendChild(checkbox);
    task.appendChild(name);
    task.appendChild(date);
    task.appendChild(deleteButton);
    taskContainer.appendChild(task);
  });
}
function addTask(name, date) {

  const newTask = {
    name: name,
    date: date,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  draw();
}
form.addEventListener("submit", function(e) {

  e.preventDefault();

  const taskName = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (taskName.length < 3 || taskName.length > 255) {
    alert("Nazwa musi mieć od 3 do 255 znaków!");
    return;
  }

  if (taskDate !== "") { //jesli data nie jest pusta, sprawdzamy czy jest w przyszłości
    const today = new Date();
    today.setHours(0, 0, 0, 0); // zaerujemy godziny sprawzamy dzien

    if (new Date(taskDate + "T00:00:00") <= today) {
      alert("Data musi być w przyszłości!");
      return;
    }
  }

  addTask(taskName, taskDate);
  form.reset();

});
function removeTask(index) {

  tasks.splice(index, 1);
  saveTasks();
  draw();
}

searchInput.addEventListener("input", function(e){
  searchTerm = searchInput.value.trim().toLowerCase();

  draw();

});



taskContainer.addEventListener("click", function(e) {

  if (e.target.classList.contains("deleteButton")) {

    const task = e.target.closest(".task");
    const index = Number(task.dataset.index);

    removeTask(index);
  }

  if (e.target.matches('input[type="checkbox"]')) {

    const task = e.target.closest(".task");
    const index = Number(task.dataset.index);

    tasks[index].completed = e.target.checked;

    saveTasks();
    draw();
  }
  if (e.target.closest(".taskName, .taskDate")) {

    const task = e.target.closest(".task");
    const index = Number(task.dataset.index);

    const nameSpan = task.querySelector(".taskName");
    const dateSpan = task.querySelector(".taskDate");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = tasks[index].name;

    const dateEditInput = document.createElement("input");
    dateEditInput.type = "date";
    dateEditInput.value = tasks[index].date;

    nameSpan.replaceWith(nameInput);
    dateSpan.replaceWith(dateEditInput);

    nameInput.focus();

    function finishEdit() {
      const newName = nameInput.value.trim();
      const newDate = dateEditInput.value;

      if (newName.length < 3 || newName.length > 255) {
        alert("Nazwa musi mieć od 3 do 255 znaków!");
        draw();
        return;
      }
      if (newDate !== "") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(newDate + "T00:00:00") <= today) {
          alert("Data musi być w przyszłości!");
          draw();
          return;
        }
      }

      tasks[index].name = newName;
      tasks[index].date = newDate;

      saveTasks();
      draw();
    }

    function checkFocusOutside() {

      setTimeout(function() {
        if (
          document.activeElement !== nameInput &&
          document.activeElement !== dateEditInput
        ) {
          finishEdit();
        }

      }, 0);
    }

    nameInput.addEventListener("blur", checkFocusOutside);
    dateEditInput.addEventListener("blur", checkFocusOutside);
  }
});

document.todo = {
  tasks: tasks,
  draw: draw,
  add: addTask,
  remove: removeTask
};

draw();
