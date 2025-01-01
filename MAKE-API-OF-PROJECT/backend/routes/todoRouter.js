const express = require("express");
const usermodel = require("../model/usermodel");
const todomodel = require("../model/todomodale");
const auth = require("../middleware/auth");
const todoRouter = express.Router();

// Get all todos for a user
todoRouter.get("/", auth, async (req, res) => {
  try {
    const userId = req.body.todoid;
    console.log("Fetching todos for userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const todos = await todomodel.find({ todoid: userId });
    console.log(todos, "GET");
    
    res.status(200).json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch todos", error: error.message });
  }
});

// Add a new todo
todoRouter.post("/addTodo", auth, async (req, res) => {
  try {
    const { todoid, todoName } = req.body;

    if (!todoid || !todoName) {
      return res.status(400).json({ message: "Both 'todoid' and 'todoName' are required" });
    }

    const newTodo = await todomodel.create({ todoid, todoName });
    res.status(201).json({ message: "Todo added successfully", newTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add todo", error: error.message });
  }
});

// Delete a todo by ID
todoRouter.delete("/deletetodo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;

    if (!todoId) {
      return res.status(400).json({ message: "Todo ID is required" });
    }
    await  todomodel.findByIdAndDelete(todoId);
    const userId = req.body.todoid;
    const todos = await todomodel.find({ todoid: userId });

    res.status(200).json({ message: "Todo deleted successfully",todos});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete todo", error: error.message });
  }
});

// Edit a todo by ID
todoRouter.put("/edittodo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const updates = req.body;

    if (!todoId || !updates) {
      return res.status(400).json({ message: "Todo ID and updates are required" });
    }

    await todomodel.findByIdAndUpdate(todoId, updates, { new: true });
    const userId = req.body.todoid;
    const todos = await todomodel.find({ todoid: userId });
    res.status(200).json({ message: "Todo updated successfully", todos });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update todo", error: error.message });
  }
});

module.exports = todoRouter;
