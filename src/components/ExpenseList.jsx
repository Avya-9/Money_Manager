import React from "react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export default function ExpenseList({ items, onRemove }) {
  if (!items.length) return <div className="empty">No expenses yet.</div>;

  return (
    <ul className="expense-list">
      {items.map((e) => (
        <li key={e.id} className="expense-item">
          <div className="left">
            <div className="title">{e.title}</div>
            <div className="date">{formatDate(e.date)}</div>
          </div>
          <div className="right">
            <div className="amount">${Number(e.amount).toFixed(2)}</div>
            <button className="remove" onClick={() => onRemove(e.id)}>
              ×
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
