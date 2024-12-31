const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = req.user.role === 'admin'
      ? await Task.find().populate('user category')
      : await Task.find({ user: req.user.id }).populate('category');
    
    res.render('taskList', { tasks, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Get task creation form
router.get('/new', auth, (req, res) => {
  res.render('taskForm', { user: req.user });
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id
    });
    await task.save();
    
    await User.findByIdAndUpdate(req.user.id, {
      $push: { tasks: task._id }
    });

    res.redirect('/tasks');
  } catch (err) {
    res.status(400).render('taskForm', { error: err.message, user: req.user });
  }
});

// Get task edit form
router.get('/:id/edit', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).render('error', { message: 'Not authorized' });
    }
    
    res.render('taskForm', { task, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).render('error', { message: 'Not authorized' });
    }
    
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/tasks');
  } catch (err) {
    res.status(400).render('taskForm', { error: err.message, user: req.user });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('error', { message: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).render('error', { message: 'Not authorized' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { tasks: req.params.id }
    });
    
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

module.exports = router;