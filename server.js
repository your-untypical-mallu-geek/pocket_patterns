const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Your MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://civinvincentvee27_db_user:civinciviya@pocketpatterns.k3tpfaw.mongodb.net/pocket-patterns?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Expense Schema & Model
const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

const Expense = mongoose.model('Expense', expenseSchema);

// GET: Fetch all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
});

// POST: Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    
    if (!amount || !category) {
      return res.status(400).json({ error: 'Amount and category are required' });
    }

    const newExpense = new Expense({ amount, category, date, notes });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));