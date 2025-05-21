document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/api/todos";

  const todoList = document.getElementById("todo-list");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const completionCount = document.getElementById("completion-count");
  const totalCount = document.getElementById("total-count");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const toastContainer = document.getElementById("toast-container");
  
  // Modal elements
  const editModal = document.getElementById("edit-modal");
  const editTodoInput = document.getElementById("edit-todo-input");
  const closeModalBtn = document.querySelector(".close-modal");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const saveEditBtn = document.getElementById("save-edit-btn");
  const editDueTimeInput = document.getElementById("edit-due-time-input");
  const editRemindAtInput = document.getElementById("edit-remind-at-input");
  
  // Modal thêm mới
  const showAddModalBtn = document.getElementById("show-add-modal-btn");
  const addModal = document.getElementById("add-modal");
  const closeAddModalBtn = document.querySelector(".close-add-modal");
  const cancelAddBtn = document.getElementById("cancel-add-btn");
  const saveAddBtn = document.getElementById("save-add-btn");
  const addTodoInput = document.getElementById("add-todo-input");
  const addDueTimeInput = document.getElementById("add-due-time-input");
  const addRemindAtInput = document.getElementById("add-remind-at-input");
  
  let currentEditId = null;

  // Lưu trữ danh sách công việc gốc
  let originalTodos = [];
  let currentFilter = "all";
  let currentSearchTerm = "";

  // Hàm hiển thị toast
  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
      toast.style.animation = 'slideOut 0.3s ease-in-out forwards';
      setTimeout(() => toast.remove(), 300);
    };
    
    toast.appendChild(messageSpan);
    toast.appendChild(closeButton);
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideOut 0.3s ease-in-out forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  // Lọc công việc theo trạng thái
  function filterTodos(filter) {
    currentFilter = filter;
    const todoItems = document.querySelectorAll(".todo-item:not(.empty-list)");
    
    todoItems.forEach(item => {
      const isCompleted = item.querySelector("input[type='checkbox']").checked;
      
      // Kiểm tra cả điều kiện lọc và tìm kiếm
      const title = item.querySelector(".title").textContent.toLowerCase();
      const matchesSearch = !currentSearchTerm || title.includes(currentSearchTerm.toLowerCase());
      const matchesFilter = 
        filter === "all" || 
        (filter === "completed" && isCompleted) || 
        (filter === "active" && !isCompleted);

      if (matchesSearch && matchesFilter) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });

    // Cập nhật trạng thái active của nút lọc
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    updateCompletionStatus();
  }

  // Tìm kiếm công việc
  function searchTodos(searchTerm) {
    currentSearchTerm = searchTerm;
    const todoItems = document.querySelectorAll(".todo-item:not(.empty-list)");
    
    // Lưu danh sách gốc nếu chưa có
    if (originalTodos.length === 0) {
      originalTodos = Array.from(todoItems).map(item => item.cloneNode(true));
    }

    // Nếu searchTerm rỗng, hiển thị lại danh sách gốc
    if (!searchTerm.trim()) {
      todoList.innerHTML = '';
      originalTodos.forEach(todo => todoList.appendChild(todo.cloneNode(true)));
      clearSearchBtn.style.display = 'none';
      filterTodos(currentFilter); // Áp dụng lại bộ lọc hiện tại
      return;
    }

    // Lọc và hiển thị kết quả
    todoItems.forEach(item => {
      const title = item.querySelector(".title").textContent.toLowerCase();
      const isCompleted = item.querySelector("input[type='checkbox']").checked;
      
      const matchesSearch = title.includes(searchTerm.toLowerCase());
      const matchesFilter = 
        currentFilter === "all" || 
        (currentFilter === "completed" && isCompleted) || 
        (currentFilter === "active" && !isCompleted);

      if (matchesSearch && matchesFilter) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });

    // Hiển thị nút xóa tìm kiếm
    clearSearchBtn.style.display = 'block';
    updateCompletionStatus();
  }

  // Xử lý sự kiện tìm kiếm
  searchInput.addEventListener("input", (e) => {
    searchTodos(e.target.value);
  });

  // Xử lý nút xóa tìm kiếm
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = '';
    searchTodos('');
  });

  // Xử lý sự kiện lọc
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterTodos(btn.dataset.filter);
    });
  });

  // Cập nhật mức độ hoàn thành
  function updateCompletionStatus() {
    const visibleTodos = document.querySelectorAll(".todo-item:not(.empty-list):not([style*='display: none'])");
    const completedTodos = document.querySelectorAll(".todo-item:not(.empty-list):not([style*='display: none']) input[type='checkbox']:checked");
    
    totalCount.textContent = visibleTodos.length;
    completionCount.textContent = completedTodos.length;
  }

  // Hiển thị modal
  function showEditModal(title, id, dueTime, remindAt) {
    currentEditId = id;
    editTodoInput.value = title;
    // Đặt giá trị cho input hạn và nhắc nhở
    editDueTimeInput.value = dueTime || '';
    editRemindAtInput.value = remindAt ? new Date(remindAt).toISOString().slice(0,16) : '';
    editModal.classList.add("show");
    editTodoInput.focus();
  }

  // Ẩn modal
  function hideEditModal() {
    editModal.classList.remove("show");
    currentEditId = null;
    editTodoInput.value = "";
  }

  // Xử lý sự kiện đóng modal
  function setupModalEvents() {
    closeModalBtn.addEventListener("click", hideEditModal);
    cancelEditBtn.addEventListener("click", hideEditModal);
    saveEditBtn.addEventListener("click", () => {
      const newTitle = editTodoInput.value.trim();
      const newDueTime = editDueTimeInput.value;
      const newRemindAt = editRemindAtInput.value;
      if (newTitle) {
        updateTodo(currentEditId, { title: newTitle, dueTime: newDueTime || null, remindAt: newRemindAt || null });
        hideEditModal();
      }
    });

    // Đóng modal khi click bên ngoài
    editModal.addEventListener("click", (e) => {
      if (e.target === editModal) {
        hideEditModal();
      }
    });

    // Đóng modal khi nhấn Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && editModal.classList.contains("show")) {
        hideEditModal();
      }
    });

    // Lưu khi nhấn Enter
    editTodoInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const newTitle = editTodoInput.value.trim();
        const newDueTime = editDueTimeInput.value;
        const newRemindAt = editRemindAtInput.value;
        if (newTitle) {
          updateTodo(currentEditId, { title: newTitle, dueTime: newDueTime || null, remindAt: newRemindAt || null });
          hideEditModal();
        }
      }
    });
  }

  // Dùng event delegation cho danh sách việc
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
          editTodo(todoId);
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
          filterTodos(currentFilter); // Áp dụng lại bộ lọc sau khi thay đổi trạng thái
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
    const title = addTodoInput.value.trim();
    const dueTime = document.getElementById("due-time-input").value;
    const remindAt = document.getElementById("remind-at-input").value;

    if (!title) {
      showToast("Vui lòng nhập nội dung công việc", "error");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, dueTime: dueTime || null, remindAt: remindAt || null }),
      });

      const data = await response.json();

      if (data.success) {
        document.getElementById("due-time-input").value = "";
        document.getElementById("remind-at-input").value = "";
        showToast("Thêm công việc thành công", "success");
        window.location.reload();
      } else {
        showToast("Không thể thêm công việc", "error");
      }
    } catch (error) {
      console.error("Lỗi khi thêm công việc:", error);
      showToast("Lỗi khi thêm công việc", "error");
    }
  }

  //Sửa việc
  function editTodo(id) {
    // Lấy thông tin hiện tại từ DOM
    const todoItem = document.querySelector(`.todo-item[data-id='${id}']`);
    const currentTitle = todoItem.querySelector(".title").textContent;
    let dueTime = '';
    let remindAt = '';
    const dueEl = todoItem.querySelector('.due-time');
    const remindEl = todoItem.querySelector('.remind-at');
    if (dueEl) {
      const rawDue = dueEl.getAttribute('data-due-time');
      if (rawDue) {
        dueTime = new Date(rawDue).toISOString().slice(0, 10);
      }
    }
    if (remindEl) {
      const rawRemind = remindEl.getAttribute('data-remind-at');
      if (rawRemind && new Date(rawRemind) > new Date()) {
        // Chuyển đổi thời gian sang định dạng phù hợp cho input datetime-local
        const remindDate = new Date(rawRemind);
        const year = remindDate.getFullYear();
        const month = String(remindDate.getMonth() + 1).padStart(2, '0');
        const day = String(remindDate.getDate()).padStart(2, '0');
        const hours = String(remindDate.getHours()).padStart(2, '0');
        const minutes = String(remindDate.getMinutes()).padStart(2, '0');
        remindAt = `${year}-${month}-${day}T${hours}:${minutes}`;
      } else {
        remindAt = '';
      }
    }
    showEditModal(currentTitle, id, dueTime, remindAt);
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
        showToast("Cập nhật công việc thành công", "success");
        window.location.reload();
      } else {
        showToast("Không thể cập nhật công việc", "error");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật công việc:", error);
      showToast("Lỗi khi cập nhật công việc", "error");
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
        showToast("Xóa công việc thành công", "success");
        window.location.reload();
      } else {
        showToast("Không thể xóa công việc", "error");
      }
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
      showToast("Lỗi khi xóa công việc", "error");
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
          showToast(data.data.message, "success");
        }
        window.location.reload();
      } else {
        showToast("Không thể xóa tất cả công việc", "error");
      }
    } catch (error) {
      console.error("Lỗi khi xóa tất cả công việc:", error);
      showToast("Lỗi khi xóa tất cả công việc", "error");
    }
  }

  // Hàm kiểm tra và nhắc nhở các công việc đến hạn remindAt
  function checkReminders(todos) {
    if (!Array.isArray(todos)) return;
    const now = Date.now();
    todos.forEach(todo => {
      if (todo.remindAt && !todo.completed) {
        const remindTime = new Date(todo.remindAt).getTime();
        const diff = remindTime - now;
        if (diff > 0 && diff < 300000) { // Nếu còn dưới 1 phút sẽ nhắc ngay
          setTimeout(() => {
            showToast(`Nhắc nhở: "${todo.title}"\nThời gian: ${new Date(todo.remindAt).toLocaleString('vi-VN')}`, "warning", 10000);
          }, diff);
        } else if (diff <= 0 && diff > -300000) { // Nếu vừa đến hạn trong vòng 1 phút
          showToast(`Nhắc nhở: "${todo.title}"\nThời gian: ${new Date(todo.remindAt).toLocaleString('vi-VN')}`, "warning", 10000);
        }
      }
    });
  }

  // Khởi tạo danh sách công việc
  async function initializeTodos() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        // ... cập nhật giao diện ...
        checkReminders(data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách công việc:", error);
    }
  }

  // Cập nhật mức độ hoàn thành khi trang được tải
  updateCompletionStatus();

  setupModalEvents();
  setupEventDelegation();

  deleteAllBtn.addEventListener("click", deleteAllTodos);

  // Ẩn nhắc nhở khi đến thời gian remindAt
  function autoHideReminders() {
    const remindEls = document.querySelectorAll('.remind-at[data-remind-at]');
    const now = Date.now();
    remindEls.forEach(el => {
      const remindAt = new Date(el.getAttribute('data-remind-at')).getTime();
      const diff = remindAt - now;
      if (diff <= 0) {
        el.style.display = 'none';
      } else {
        setTimeout(() => {
          el.style.display = 'none';
        }, diff);
      }
    });
  }

  // Hiện modal thêm mới
  showAddModalBtn.addEventListener("click", () => {
    addModal.classList.add("show");
    addTodoInput.value = "";
    addDueTimeInput.value = "";
    addRemindAtInput.value = "";
    addTodoInput.focus();
  });
  // Ẩn modal thêm mới
  function hideAddModal() {
    addModal.classList.remove("show");
  }
  closeAddModalBtn.addEventListener("click", hideAddModal);
  cancelAddBtn.addEventListener("click", hideAddModal);
  // Lưu công việc mới từ modal
  saveAddBtn.addEventListener("click", async () => {
    const title = addTodoInput.value.trim();
    const dueTime = addDueTimeInput.value;
    const remindAt = addRemindAtInput.value;
    if (!title) {
      showToast("Vui lòng nhập nội dung công việc", "error");
      return;
    }
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, dueTime: dueTime || null, remindAt: remindAt || null }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("Thêm công việc thành công", "success");
        window.location.reload();
      } else {
        showToast("Không thể thêm công việc", "error");
      }
    } catch (error) {
      showToast("Lỗi khi thêm công việc", "error");
    }
    hideAddModal();
  });
  // Đóng modal khi click nền tối
  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) hideAddModal();
  });
  // Đóng modal khi nhấn Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && addModal.classList.contains("show")) {
      hideAddModal();
    }
  });

  // Khởi tạo ứng dụng
  initializeTodos();
  autoHideReminders();
});
