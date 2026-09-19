let todos = JSON.parse(localStorage.getItem("todos")) || [];

const todoForm = document.querySelector("#todo-form"); //form
const todoInput = document.querySelector("#todo-input"); //input
const todoList = document.querySelector("#todo-list"); //ul
const formBtn = document.querySelector("#form-btn");
const taskCount = document.querySelector("#task-count");
const completeCount = document.querySelector("#complete-count");
const cancelBtn = document.querySelector("#cancel-btn");

let editTodoId = null;

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoValue = todoInput.value.trim();

  //agar todo ki value empty hai means "" then we do !"" -> true and ! is logical not operator
  if (!todoValue) {
    return;
  }

  if (editTodoId) {
    //editing
    todos = todos.map((todo) => {
      if (todo.id === Number(editTodoId)) {
        return {
          ...todo,
          text: todoValue,
        };
      }
      return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    update();
  } else {
    //adding
    let newTodo = {
      id: Date.now(),
      text: todoValue,
      isCompleted: false,
    };

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos)); // array ko string me convert kroge to [object object] aise show hoga jo ki valid nahi hai isliye ham json.stringify use krte hai valid string ke liye.
  }

  todoInput.value = "";

  renderTodo(); // calling it whenever updation happens.
});

//niche wala loop ek bar hi chalega jab ham page open kar dete hai. multiple time chlane ke liye ham isse ek function me rakhte haii.
function renderTodo() {
  todoList.innerHTML = ""; //ye phle wala array ko hatayega or new add hogi

  todos.forEach(function (todo) {
    addTodo(todo);
  });

  taskCount.textContent = `TASKS(${todos.length})`;
  completeCount.textContent = `COMPLETED(${todos.filter((todo) => todo.isCompleted).length})`;
}

renderTodo();

function addTodo(todo) {
  const li = document.createElement("li"); // <li></li>

  // li.textContent = todo.text //<li>{Actuall Todo}</li>

  li.dataset.id = todo.id;

  li.className = `flex gap-2 border border-slate-400 p-4 rounded-xl items-center`;

  li.innerHTML = `
                    <input data-id=${todo.id} data-action="toggle" type="checkbox" ${
                      todo.isCompleted === true ? "checked" : ""
                    } >
                    <p class="flex-1 ${todo.isCompleted ? "line-through text-black/60" : " "} ">${todo.text}</p>
                    <div class="flex gap-2">
                        <button data-action="edit" data-id=${
                          todo.id
                        } class="bg-amber-300 px-3 text-slate-900 py-1 rounded-lg hover:bg-amber-400" >Edit</button>
                        <button data-action="delete" data-id=${
                          todo.id
                        } class="bg-red-400 text-white hover:bg-red-500 rounded-lg px-3 py-1" >Delete</button>
                    </div>
                `;

  todoList.append(li); //ul -> li
}

//event delegation
todoList.addEventListener("click", (e) => {
  let li = e.target.closest("li");

  let action = e.target.dataset.action;

  let id = li?.dataset?.id;

  //   let chkbox = e.target.closest('input[type="checkbox"]'); // css selector to select only checkbox input element.

  if (action === "edit") {
    startEdit(id);
  }

  if (action === "delete") {
    deleteTodo(id);
  }

  if (action === "toggle") {
    todos = todos.map((todo) => {
      if (todo.id === Number(id)) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo();
  }
});

function deleteTodo(id) {
  todos = todos.filter((todo) => {
    // Backend Remove
    if (todo.id !== Number(id)) {
      return todo;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodo();
}

function startEdit(id) {
  editTodoId = id;

  let currentTodo = todos.find((todo) => {
    //find return single entity when it find and stop the loop of finding.
    if (todo.id === Number(id)) {
      return todo;
    }
  });

  todoInput.value = currentTodo.text;
  formBtn.classList.add("bg-orange-500");
  formBtn.textContent = "Update";
  cancelBtn.classList.remove("hidden");
}

function update() {
  editTodoId = null;
  formBtn.classList.remove("bg-orange-500");
  formBtn.textContent = "Add";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  todoInput.value = "";
  update();
});
