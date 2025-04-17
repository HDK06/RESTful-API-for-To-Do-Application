const Todo = require("../models/Todo");

// Lấy tất cả công việc
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy một công việc theo ID
exports.getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

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

// Tạo công việc mới
exports.createTodo = async (req, res, next) => {
  try {
    // Kiểm tra đầu vào đơn giản
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập nội dung công việc",
      });
    }

    // Tạo công việc
    const todo = await Todo.create(req.body);

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật công việc
exports.updateTodo = async (req, res, next) => {
  try {
    // Đảm bảo completed là kiểu Boolean
    if (req.body.completed !== undefined) {
      req.body.completed =
        req.body.completed === "true" || req.body.completed === true;
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

// Xóa công việc
exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy công việc",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tất cả công việc
exports.deleteAllTodos = async (req, res, next) => {
  try {
    await Todo.deleteMany({});

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
