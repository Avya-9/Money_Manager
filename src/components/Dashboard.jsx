import React, { useMemo, useState } from "react";

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

function groupBy(transactions, granularity = "monthly", limit = 12) {
  const map = new Map();
  transactions.forEach((t) => {
    const d = new Date(t.date);
    let key;
    if (granularity === "daily") key = d.toISOString().slice(0, 10);
    else if (granularity === "weekly") key = `${d.getFullYear()}-W${getWeekNumber(d)}`;
    else if (granularity === "monthly") key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    else key = String(d.getFullYear());

    if (!map.has(key)) map.set(key, { income: 0, expense: 0, net: 0, key });
    const entry = map.get(key);
    const n = Number(t.amount) || 0;
    if (t.type === "income") entry.income += n;
    else if (t.type === "expense") entry.expense += n;
    else if (t.type === "lend") entry.net += 0; // not counted in income/expense
    else if (t.type === "borrow") entry.net += 0;
    else if (t.type === "adjustment") entry.net += n; // adjustments affect net
    entry.net += t.type === "expense" ? -n : t.type === "income" ? n : 0;
  });

  const arr = Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1));
  return arr.slice(0, limit);
}

export default function Dashboard({ transactions, personsMap = {} }) {
  const [granularity, setGranularity] = useState("monthly");

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const n = Number(t.amount) || 0;
        if (t.type === "income") acc.income += n;
        else if (t.type === "expense") acc.expense += n;
        else if (t.type === "lend") acc.lend += n;
        else if (t.type === "borrow") acc.borrow += n;
        else if (t.type === "adjustment") acc.adjustment += n;
        return acc;
      },
      { income: 0, expense: 0, lend: 0, borrow: 0, adjustment: 0 }
    );
  }, [transactions]);

  const buckets = useMemo(() => groupBy(transactions, granularity, 12), [transactions, granularity]);

  return (
    <div>
      <h3>Dashboard</h3>
      <div className="filter-row">
        <label>View:</label>
        <select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="summary-row">
        <div className="summary-card">Income: <strong>${totals.income.toFixed(2)}</strong></div>
        <div className="summary-card">Expense: <strong>${totals.expense.toFixed(2)}</strong></div>
        <div className="summary-card">Lent: <strong>${totals.lend.toFixed(2)}</strong></div>
        <div className="summary-card">Borrowed: <strong>${totals.borrow.toFixed(2)}</strong></div>
      </div>

      <div className="buckets">
        {buckets.map((b) => (
          <div key={b.key} className="bucket">
            <div className="bucket-key">{b.key}</div>
            <div className="bucket-values">Income ${b.income.toFixed(2)} · Expense ${b.expense.toFixed(2)} · Net ${b.net.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="people-balances">
        <h4>People Balances</h4>
        {Object.keys(personsMap).length === 0 ? (
          <div className="empty">No people tracked.</div>
        ) : (
          <ul className="person-list">
            {Object.values(personsMap)
              .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
              .map((p) => (
                <li key={p.id} className="person-row">
                  <div className="person-name">{p.name}</div>
                  <div className={`person-balance ${p.balance >= 0 ? 'pos' : 'neg'}`}>
                    {p.balance >= 0 ? '+' : '-'}${Math.abs(p.balance).toFixed(2)}
                  </div>
                  <div className="person-status">
                    {p.balance > 0 && <span>They owe you</span>}
                    {p.balance < 0 && <span>You owe them</span>}
                    {p.balance === 0 && <span>Settled</span>}
                  </div>
                  <div style={{marginLeft:12}}>
                    <button onClick={() => (window._openPerson && window._openPerson(p.id)) || null}>View Txns</button>
                    <button style={{marginLeft:8}} onClick={() => (window._openPeopleManager && window._openPeopleManager(true)) || null}>Manage</button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
