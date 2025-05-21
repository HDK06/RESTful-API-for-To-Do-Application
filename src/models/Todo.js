const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
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
    dueTime: {
      type: Date,
      default: null,
    },
    remindAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

// Thêm phương thức tìm kiếm
TodoSchema.statics.searchTodos = async function(searchTerm) {
  const searchRegex = new RegExp(searchTerm, 'i');
  return this.find({ title: searchRegex }).sort({ updatedAt: -1 });
};

// Thêm phương thức lọc theo trạng thái
TodoSchema.statics.filterTodos = async function(filter) {
  let query = {};
  
  if (filter === 'completed') {
    query.completed = true;
  } else if (filter === 'active') {
    query.completed = false;
  }
  
  return this.find(query).sort({ updatedAt: -1 });
};

// Thêm phương thức lọc và tìm kiếm kết hợp
TodoSchema.statics.filterAndSearch = async function(filter, searchTerm) {
  let query = {};
  
  if (searchTerm) {
    query.title = new RegExp(searchTerm, 'i');
  }
  
  if (filter === 'completed') {
    query.completed = true;
  } else if (filter === 'active') {
    query.completed = false;
  }
  
  return this.find(query).sort({ updatedAt: -1 });
};

module.exports = mongoose.model("Todo", TodoSchema);
