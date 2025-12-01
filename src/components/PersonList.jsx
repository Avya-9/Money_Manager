import React, { useState } from "react";

export default function PersonList({ persons, transactions, personsMap, selectedPersonId = null }) {
  const list = Object.values(personsMap || {});
  const [selected, setSelected] = useState(null);

  React.useEffect(() => {
    if (selectedPersonId) setSelected(selectedPersonId);
  }, [selectedPersonId]);

  if (!list.length) return <div className="empty">No people tracked yet.</div>;

  // show net of all people at top
  const net = list.reduce((s, p) => s + (p.balance || 0), 0);

  return (
    <div>
      <h3>People</h3>
      <div style={{marginBottom:8}}>Net across people: <strong>₹{net.toFixed(2)}</strong></div>
      <ul className="person-list">
        {list.sort((a,b)=>Math.abs(b.balance)-Math.abs(a.balance)).map((p) => (
          <li key={p.id} className="person-item">
            <div>
              <div className="person-name">{p.name}</div>
              <div className={`person-balance ₹{p.balance >= 0 ? 'pos' : 'neg'}`}>
                {p.balance >= 0 ? '+' : '-'}₹{Math.abs(p.balance).toFixed(2)}
              </div>
            </div>
            <div>
              <button onClick={() => setSelected(selected === p.id ? null : p.id)}>View</button>
            </div>
            {selected === p.id && (
              <div className="person-transactions">
                {(p.items || []).map((it) => (
                  <div key={it.id} className="pt-item">{it.title} · {it.type} · ₹{Number(it.amount).toFixed(2)}</div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
