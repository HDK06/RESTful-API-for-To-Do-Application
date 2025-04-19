document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/api/todos";

  const todoList = document.getElementById("todo-list");
  const submitAddBtn = document.getElementById("submit-add-btn");
  const newTodoInput = document.getElementById("new-todo-input");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  setupEventDelegation();

  submitAddBtn.addEventListener("click", addTodo);
  deleteAllBtn.addEventListener("click", deleteAllTodos);

  // Thêm bằng phím Enter
  newTodoInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  // Dùng event delegation cho danh sách công việc
  function setupEventDelegation() {
    todoList.addEventListener("click", (e) => {
      //Nút sửa
      if (
        e.target.classList.contains("edit-btn") ||
        e.target.closest(".edit-btn")
      ) {
        const todoItem = e.target.closest(".todo-item");
        if (todoItem) {
          const todoId = todoItem.dataset.id;
          const currentTitle = todoItem.querySelector(".title").textContent;
          editTodo(todoId, currentTitle);
        }
      }

      //Nút xóa
      if (
        e.target.classList.contains("delete-btn") ||
        e.target.closest(".delete-btn")
      ) {
        const todoItem = e.target.closest(".todo-item");
        if (todoItem) {
          const todoId = todoItem.dataset.id;
          deleteTodo(todoId);
        }
      }
    });

    //Checkboxes
    todoList.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        const todoItem = e.target.closest(".todo-item");
        if (todoItem) {
          const todoId = todoItem.dataset.id;
          const isCompleted = e.target.checked;
          const titleEl = todoItem.querySelector(".title");

          if (isCompleted) {
            titleEl.classList.add("completed");
          } else {
            titleEl.classList.remove("completed");
          }

          updateTodoStatus(todoId, isCompleted);
        }
      }
    });
  }

  //Trạng thái hoàn thành việc
  async function updateTodoStatus(id, completed) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: completed }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error("Không thể cập nhật trạng thái công việc", data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái công việc:", error);
      window.location.reload();
    }
  }

  //Thêm việc
  async function addTodo() {
    const title = newTodoInput.value.trim();

    if (!title) {
      alert("Vui lòng nhập nội dung công việc");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (data.success) {
        newTodoInput.value = "";
        window.location.reload(); // Tải lại trang để hiện việc mới
      } else {
        alert("Không thể thêm công việc");
      }
    } catch (error) {
      console.error("Lỗi khi thêm công việc:", error);
      alert("Lỗi khi thêm công việc");
    }
  }

  //Sửa việc
  function editTodo(id, currentTitle) {
    const newTitle = prompt("Nhập nội dung công việc mới:", currentTitle);

    if (newTitle === null) return; //Hủy

    if (newTitle.trim() === "") {
      alert("Nội dung công việc không được để trống");
      return;
    }

    updateTodo(id, { title: newTitle });
  }

  //Cập nhật việc
  async function updateTodo(id, updates) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        window.location.reload(); // Tải lại trang để hiện thay đổi
      } else {
        alert("Không thể cập nhật công việc");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật công việc:", error);
      alert("Lỗi khi cập nhật công việc");
    }
  }

  // Xóa việc
  async function deleteTodo(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        window.location.reload(); // Tải lại trang để cập nhật danh sách
      } else {
        alert("Không thể xóa công việc");
      }
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
      alert("Lỗi khi xóa công việc");
    }
  }

  // Xóa tất cả việc
  async function deleteAllTodos() {
    if (!confirm("Bạn có chắc chắn muốn xóa tất cả công việc?")) {
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        if (data.data && data.data.message) {
          alert(data.data.message);
        }
        window.location.reload(); // Tải lại trang để cập nhật danh sách
      } else {
        alert("Không thể xóa tất cả công việc");
      }
    } catch (error) {
      console.error("Lỗi khi xóa tất cả công việc:", error);
      alert("Lỗi khi xóa tất cả công việc");
    }
  }
});
