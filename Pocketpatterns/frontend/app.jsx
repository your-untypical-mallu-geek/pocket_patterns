import React, { useState, useEffect } from 'react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error('Error connecting to backend:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), category, date })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save expense');

      setExpenses([data, ...expenses]);
      setAmount('');
    } catch (err) {
      setError(err.message);
    }
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Pocket Patterns: Spending Journal</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-blue-600">${totalSpent.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-50 p-4 border rounded-lg">
          <h2 className="font-semibold text-gray-700">Log Expense</h2>
          <input 
            type="number" 
            step="0.01" 
            placeholder="Amount ($)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded bg-white text-sm"
            required
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded bg-white text-sm"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded bg-white text-sm"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm font-medium">
            Add Expense Entry
          </button>
        </form>

        <h2 className="font-semibold text-gray-700 mb-3">Expense History</h2>
        <ul className="space-y-2">
          {expenses.map(item => (
            <li key={item._id} className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg">
              <span className="text-gray-800 font-medium">{item.category} ({new Date(item.date).toLocaleDateString()})</span>
              <span className="font-bold text-gray-900">${item.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}