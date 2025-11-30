import React from "react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export default function TransactionList({ items, onRemove, personsMap, filterPersonId = null, onClearFilter }) {
  const filtered = filterPersonId ? items.filter((t) => t.personId === filterPersonId) : items;
  if (!filtered.length) return <div className="empty">No transactions yet.</div>;

  return (
    <div>
      {filterPersonId && (
        <div className="filter-row">
          <div>Showing transactions for: <strong>{personsMap && personsMap[filterPersonId] ? personsMap[filterPersonId].name : filterPersonId}</strong></div>
          <div style={{marginLeft:'auto'}}>
            <button onClick={onClearFilter}>Clear</button>
          </div>
        </div>
      )}

      <ul className="expense-list">
        {filtered.map((t) => (
          <li key={t.id} className="expense-item">
            <div className="left">
              <div className="title">{t.title}</div>
              <div className="meta">{t.type} · {t.person || (t.personId && personsMap && personsMap[t.personId] ? personsMap[t.personId].name : "—")} · {formatDate(t.date)}</div>
            </div>
            <div className="right">
              <div className={`amount ${t.type === 'income' || t.type === 'lend' ? 'pos' : 'neg'}`}>
                {t.type === 'expense' || t.type === 'borrow' ? '-' : ''}${Math.abs(Number(t.amount) || 0).toFixed(2)}
              </div>
              <button
                className="remove"
                onClick={() => {
                  const amt = Math.abs(Number(t.amount) || 0).toFixed(2);
                  const name = t.title || (t.person || 'transaction');
                  if (window.confirm(`Delete "${name}" — $${amt}? This action cannot be undone.`)) {
                    onRemove(t.id);
                  }
                }}
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
