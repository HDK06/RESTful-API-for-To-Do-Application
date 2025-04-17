const express = require("express");
const router = express.Router();
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
} = require("../controllers/todoController");

router.route("/").get(getTodos).post(createTodo).delete(deleteAllTodos);

router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

module.exports = router;
