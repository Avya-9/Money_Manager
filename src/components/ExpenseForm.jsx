import React, { useState } from "react";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !amount || !date) return;
    const expense = {
      id: uid(),
      title: title.trim(),
      amount: Number(amount),
      date: new Date(date).toISOString(),
    };
    onAdd(expense);
    setTitle("");
    setAmount("");
    setDate("");
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="row">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="row">
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="row">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="row actions">
        <button type="submit">Add Expense</button>
      </div>
    </form>
  );
}
