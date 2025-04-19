const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");
const todoRoutes = require("./src/routes/todoRoutes");
const errorHandler = require("./src/middlewares/errorHandler");
const path = require("path");
const Todo = require("./src/models/Todo");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/todos", todoRoutes);

app.get("/", async (req, res) => {
  try {
    // Lấy tất cả công việc, sắp xếp theo thời gian (mới nhất xếp trước)
    const todos = await Todo.find().sort({ updatedAt: -1 });

    res.render("index", { todos });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công việc:", error);
    res.render("index", { todos: [] });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Lỗi: ${err.message}`);
  server.close(() => process.exit(1));
});
