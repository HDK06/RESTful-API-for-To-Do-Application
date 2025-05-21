const Todo = require("../models/Todo");

exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ updatedAt: -1 });

    //200: OK, yêu cầu thành công
    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    // Kiểm tra nội dung trống
    if (!req.body.title || req.body.title.trim() === "") {
      //400: yêu cầu không hợp lệ
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập nội dung công việc",
      });
    }

    // Xử lý dueTime và remindAt nếu có
    let todoData = { ...req.body };
    if (todoData.dueTime) todoData.dueTime = new Date(todoData.dueTime);
    if (todoData.remindAt) todoData.remindAt = new Date(todoData.remindAt);

    const todo = await Todo.create(todoData);

    //201: Tạo thành công
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() },
      {
        new: true,
        runValidators: true,
      }
    );

    //404: Không tìm thấy việc
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy công việc",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAllTodos = async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({});

    let message = "Đã xóa tất cả công việc";
    if (result.deletedCount === 0) {
      message = "Không có công việc nào để xóa";
    }

    res.status(200).json({
      success: true,
      data: {
        deleted: result.deletedCount,
        message: message,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Tìm kiếm công việc
exports.searchTodos = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập từ khóa tìm kiếm"
      });
    }

    const todos = await Todo.searchTodos(searchTerm);
    
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm công việc",
      error: error.message
    });
  }
};

// Lọc công việc theo trạng thái
exports.filterTodos = async (req, res) => {
  try {
    const { filter } = req.query;
    
    if (!filter || !['all', 'completed', 'active'].includes(filter)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái lọc không hợp lệ"
      });
    }

    const todos = await Todo.filterTodos(filter);
    
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lọc công việc",
      error: error.message
    });
  }
};

// Lọc và tìm kiếm kết hợp
exports.filterAndSearch = async (req, res) => {
  try {
    const { filter, searchTerm } = req.query;
    
    if (!filter || !['all', 'completed', 'active'].includes(filter)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái lọc không hợp lệ"
      });
    }

    const todos = await Todo.filterAndSearch(filter, searchTerm);
    
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lọc và tìm kiếm công việc",
      error: error.message
    });
  }
};
