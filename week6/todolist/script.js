const form = document.querySelector("form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

let todos = [];

function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText.length > 50) {
    alert("ข้อความต้องไม่เกิน 50 ตัวอักษร");
    return;
  }

  if (todoText.length > 0) {
    const todo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };

    todos.push(todo);
    todoInput.value = "";
    renderTodos();
  }
}

function deleteTodo(id) {

  const isConfirm = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?");
  if (isConfirm) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  }
}

function toggleCompleted(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");

    const myCheck = document.createElement("input");
    myCheck.setAttribute("type", "checkbox");
    myCheck.checked = todo.completed;
    myCheck.addEventListener("change", () => toggleCompleted(todo.id));

    const todoText = document.createElement("span");
    todoText.textContent = todo.text;

    if (todo.completed) {
      todoText.style.textDecoration = "line-through";
      todoItem.classList.add("completed");
    }

    const todoDeleteButton = document.createElement("button");
    todoDeleteButton.textContent = "Delete";

    todoDeleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    todoItem.appendChild(myCheck);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoDeleteButton);

    todoList.appendChild(todoItem);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

renderTodos();