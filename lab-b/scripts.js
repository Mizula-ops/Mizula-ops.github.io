console.debug("Hello world!");

form =document.getElementById("taskForm");
taskContainer = document.getElementById("taskContainer");

taskInput = document.getElementById("value");

dateInput = document.getElementById("date");

form.addEventListener("submit",function(e){
  e.preventDefault();
  const taskName=taskInput.value;
  const taskDate = dateInput.value;
  console.log(taskName);

  console.log(taskDate);
  console.log("Kliknięto Dodaj!");
  const task = document.createElement("div");
  task.className="task";
  const checkbox=document.createElement("input");
  checkbox.type="checkbox"
  const name = document.createElement("span");
  name.className="taskName";
  name.textContent=taskName;
  const date=document.createElement("span");
  date.className="taskDate";
  date.textContent=taskDate

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className="deleteButton"
  deleteButton.textContent = "Usuń";
  task.appendChild(checkbox);
  task.appendChild(name);
  task.appendChild(date);
  task.appendChild(deleteButton);

  taskContainer.appendChild(task);
  form.reset();


})
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", function(e){
  const searchTerm = searchInput.value.trim().toLowerCase();

  const tasks = taskContainer.querySelectorAll(".task");

  tasks.forEach(function(task) {
    const taskName = task.querySelector(".taskName").textContent.toLowerCase();
    if (searchTerm.length >= 3 && taskName.includes(searchTerm)) {
      task.style.display = "flex";
    } else if(searchTerm.length < 3) {
      task.style.display = "flex";
    }
    else {
      task.style.display = "none";
    }
  });

  console.log(searchTerm);
});

taskContainer.addEventListener("click", function(e){
  if (e.target.classList.contains("deleteButton")) {
    e.preventDefault();
    const task = e.target.closest(".task");
    task.remove();
  }
});
