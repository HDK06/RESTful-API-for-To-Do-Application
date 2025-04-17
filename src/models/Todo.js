const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  sequentialId: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Vui lòng nhập công việc"],
    trim: true,
    maxlength: [500, "Công việc không được vượt quá 500 ký tự"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware trước khi lưu để tự động tạo sequentialId
TodoSchema.pre("save", async function (next) {
  // Chỉ thêm sequentialId nếu là tài liệu mới
  if (this.isNew) {
    try {
      // Tìm giá trị sequentialId lớn nhất hiện tại
      const maxTodo = await this.constructor.findOne(
        {},
        { sequentialId: 1 },
        { sort: { sequentialId: -1 } }
      );
      // Nếu không có todo nào, đặt sequentialId = 1, ngược lại tăng thêm 1
      this.sequentialId =
        maxTodo && maxTodo.sequentialId ? maxTodo.sequentialId + 1 : 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Todo", TodoSchema);
