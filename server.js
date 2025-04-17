const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./src/config/database");
const todoRoutes = require("./src/routes/todoRoutes");
const errorHandler = require("./src/middlewares/errorHandler");
const path = require("path");
// Không cần thiết node-fetch vì ta sẽ không gọi API của chính mình
// Import service thay vì gọi API
const Todo = require("./src/models/Todo");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes
app.use("/api/todos", todoRoutes);

// Root route to render the EJS template
app.get("/", async (req, res) => {
  try {
    // Lấy dữ liệu trực tiếp từ model thay vì gọi API
    const todos = await Todo.find().sort({ createdAt: -1 });

    // Render the index template with todos data
    res.render("index", { todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.render("index", { todos: [] });
  }
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
