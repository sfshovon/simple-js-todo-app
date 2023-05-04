let todoInput = document.querySelector(".todo-input input");
let taskStatus = document.querySelectorAll(".task-status span");
let clearAll = document.querySelector(".clear-all-btn");
let tasksContainer = document.querySelector(".tasks-container");
let editId;
let isEditTask = false; //checks whether the current operation is edit or delete
let todos = JSON.parse(localStorage.getItem("todo-list"));

taskStatus.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active"); //removes the "active" class from the currently active task status button
    btn.classList.add("active"); //"active" class is added to the button that was clicked
    showTodo(btn.id); //function is called with the id of the clicked task status button
  });
});

// filters the list of tasks based on the selected task status and displays the filtered list
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
  // if there are no task, a meesage is displayed otherwise created lists are displayed
  tasksContainer.innerHTML = liTag || `<span>You don't have any task here</span>`;
  let checkTask = tasksContainer.querySelectorAll(".task");
  // disable the clear all button if there's no task, otherwise keep it enable
  !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
  // If it exceeds the height, overflow is added to enable scrolling
  tasksContainer.offsetHeight >= 300 ? tasksContainer.classList.add("overflow") : tasksContainer.classList.remove("overflow");
}

// by default, all todo lists are shown
showTodo("all");

// shows and hides and the menu option for each task
const showMenu = (selectedTask) => {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show"); //shows the menu items for the clicked task
  document.addEventListener("click", e => {
    if(e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");  //menu options are hidden when the user clicks anywhere outside the menu
    }
  });
}

// updates the status of each task
const updateStatus = (selectedTask) =>{
  let taskName = selectedTask.parentElement.lastElementChild;
  // when checkbox is checked, change the status to completed
  if(selectedTask.checked) {
      taskName.classList.add("checked");
      todos[selectedTask.id].status = "completed";
  } 
  // when checkbox is not checked, change the status to pending
  else {
      taskName.classList.remove("checked");
      todos[selectedTask.id].status = "pending";
  }
  // update todos in localstorage
  localStorage.setItem("todo-list", JSON.stringify(todos))
}

// edit a task
const editTask = (taskId, textName) => {
  editId = taskId;
  isEditTask = true;
  todoInput.value = textName; //set the input field with the current task name
  todoInput.focus(); // focused so that the user can edit the name
  todoInput.classList.add("active"); //active is added to the input field so that it is highlighted
}

// delete a task
const deleteTask = (deleteId, filter) => {
  isEditTask = false;
  todos.splice(deleteId, 1); //remove the task from the todos array at the given index deleteId
  localStorage.setItem("todo-list", JSON.stringify(todos)); //update the local storage
  showTodo(filter); //show the updated list
}

// clears all the tasks from the list and also removes them from the local storage.
const handleClickClearAll = () => {
  isEditTask = false;
  todos.splice(0,todos.length); //remove all the elements from the todos array starting from index 0 and up to the length of the array
  localStorage.setItem("todo-list", JSON.stringify(todos)); //update the local storage
  showTodo() //show the updated list
}

// adds a task
const handleClickAdd = () => {
  let userTask = todoInput.value.trim(); //trims extra spaces from the input value
  if(userTask) {
    // if its a new task
    if(!isEditTask) {
      todos = !todos ? [] : todos; //checks if todos array exists. If not, it creates an empty array
      let taskInfo = {name: userTask, status: "pending"};
      todos.push(taskInfo); //add the new task into the array
    } 
    // if its a old task to update, update the task
    else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    todoInput.value = ""; //reset the input field
    localStorage.setItem("todo-list", JSON.stringify(todos)); //updtae todo list
    showTodo(document.querySelector("span.active").id);
  }
}

//event listener for when the user types on the keyboard while the input field with id todoInput is focused
todoInput.addEventListener("keyup", e => {
  let userTask = todoInput.value.trim();
  // If the key pressed is the "Enter" key and the input field is not empty, it performs the same actions as the handleClickAdd function.
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

