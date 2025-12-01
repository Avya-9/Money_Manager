import React, { useState } from "react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString();
}

export default function TransactionList({ items, onRemove, personsMap, filterPersonId = null, onClearFilter }) {
  const [expandedId, setExpandedId] = useState(null);
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
              {t.image && (
                <button 
                  type="button" 
                  onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  style={{marginTop: '8px', padding: '4px 8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}
                >
                  {expandedId === t.id ? 'Hide Image' : 'Show Image'}
                </button>
              )}
              {expandedId === t.id && t.image && (
                <div style={{marginTop: '8px'}}>
                  <img src={t.image} alt={t.title} style={{maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.2)'}} />
                </div>
              )}
            </div>
            <div className="right">
              <div className={`amount ${t.type === 'income' || t.type === 'lend' ? 'pos' : 'neg'}`}>
                {t.type === 'expense' || t.type === 'borrow' ? '-' : ''}₹{Math.abs(Number(t.amount) || 0).toFixed(2)}
              </div>
              <button
                className="remove"
                onClick={() => {
                  const amt = Math.abs(Number(t.amount) || 0).toFixed(2);
                  const name = t.title || (t.person || 'transaction');
                  if (window.confirm(`Delete "${name}" — ₹${amt}? This action cannot be undone.`)) {
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
