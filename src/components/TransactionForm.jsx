import React, { useState } from "react";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function TransactionForm({ onAdd, persons = [] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [type, setType] = useState("expense");
  const [person, setPerson] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!amount && amount !== 0) {
      setError("Please enter an amount.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if ((type === "lend" || type === "borrow") && !person.trim()) {
      setError("Please enter a person for lend/borrow.");
      return;
    }
    const tx = {
      id: uid(),
      title: title.trim(),
      amount: Number(amount),
      date: new Date(date).toISOString(),
      type,
      person: person ? person.trim() : "",
    };
    onAdd(tx);
    setTitle("");
    setAmount("");
    // keep date/type/person to allow adding multiple items quickly
    // setDate(today);
    // setType("expense");
    // setPerson("");
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

      <div className="row">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="lend">Lend (you gave)</option>
          <option value="borrow">Borrow (you took)</option>
        </select>
      </div>

      {(type === "lend" || type === "borrow") && (
        <div className="row">
          <label>Person</label>
          <input list="persons-list" value={person} onChange={(e) => setPerson(e.target.value)} />
          <datalist id="persons-list">
            {persons.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
        </div>
      )}

      <div className="row actions">
        <button type="submit">Add</button>
      </div>
      {error && (
        <div className="form-error" role="alert">
          <strong style={{marginRight:8}}>Error:</strong> {error}
        </div>
      )}
    </form>
  );
}
