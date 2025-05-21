const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  searchTodos,
  filterTodos,
  filterAndSearch
} = require("../controllers/todoController");

router.route("/").get(getTodos).post(createTodo).delete(deleteAllTodos);

router.route("/:id").put(updateTodo).delete(deleteTodo);

router.get("/search", searchTodos);

router.get("/filter", filterTodos);

router.get("/filter-search", filterAndSearch);

module.exports = router;
