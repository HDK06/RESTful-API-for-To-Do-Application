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

    const todo = await Todo.create(req.body);

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
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
      success: true,
      data: {},
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
