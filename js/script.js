let todoInput = document.querySelector(".todo-input input");
let taskStatus = document.querySelectorAll(".task-status span");
let clearAll = document.querySelector(".clear-all-btn");
let tasksContainer = document.querySelector(".tasks-container");
let editId;
let isEditTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));

taskStatus.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

const showTodo = (filter) => {
  let liTag = "";
  if(todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status === "completed" ? "checked" : "";
        if(filter == todo.status || filter == "all") {
          liTag += 
          `<li class="task-list">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
              <p class="${completed}">${todo.name}</p>
            </label>
            <div class="settings">
              <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
              <ul class="task-menu">
                <li onclick='editTask(${id}, "${todo.name}")'>
                  <i class="fa-solid fa-pen"></i>
                    Edit
                </li>
                <li onclick='deleteTask(${id}, "${filter}")'>
                  <i class="fa-solid fa-trash"></i>
                    Delete
                </li>
              </ul>
            </div>
          </li>`;
      }
    });
  }
  tasksContainer.innerHTML = liTag || `<span>You don't have any task here</span>`;
  let checkTask = tasksContainer.querySelectorAll(".task");
  !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
  tasksContainer.offsetHeight >= 300 ? tasksContainer.classList.add("overflow") : tasksContainer.classList.remove("overflow");
}
showTodo("all");

const showMenu = (selectedTask) => {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", e => {
    if(e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

const updateStatus = (selectedTask) =>{
  let taskName = selectedTask.parentElement.lastElementChild;
  if(selectedTask.checked) {
      taskName.classList.add("checked");
      todos[selectedTask.id].status = "completed";
  } 
  else {
      taskName.classList.remove("checked");
      todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos))
}

const editTask = (taskId, textName) => {
  editId = taskId;
  isEditTask = true;
  todoInput.value = textName;
  todoInput.focus();
  todoInput.classList.add("active");
}

const deleteTask = (deleteId, filter) => {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

const handleClickClearAll = () => {
  isEditTask = false;
  todos.splice(0,todos.length); 
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo()
}

const handleClickAdd = () => {
  let userTask = todoInput.value.trim();
  if(userTask) {
    if(!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = {name: userTask, status: "pending"};
      todos.push(taskInfo);
    } 
    else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    todoInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
}

todoInput.addEventListener("keyup", e => {
  let userTask = todoInput.value.trim();
  if(e.key == "Enter" && userTask) {
    if(!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = {name: userTask, status: "pending"};
        todos.push(taskInfo);
    } 
    else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    todoInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});

