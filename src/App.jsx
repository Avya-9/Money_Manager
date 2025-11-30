import React, { useEffect, useState, useMemo } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Dashboard from "./components/Dashboard";
import PersonList from "./components/PersonList";
import PeopleManager from "./components/PeopleManager";

const TX_KEY = "transactions_v1";
const PERSONS_KEY = "persons_v1";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [persons, setPersons] = useState([]);
  const [transactionFilterPersonId, setTransactionFilterPersonId] = useState(null);
  const [showPeopleManager, setShowPeopleManager] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TX_KEY);
      if (raw) setTransactions(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load transactions", e);
    }

    try {
      const praw = localStorage.getItem(PERSONS_KEY);
      if (praw) setPersons(JSON.parse(praw));
    } catch (e) {
      console.error("Failed to load persons", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TX_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error("Failed to save transactions", e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(PERSONS_KEY, JSON.stringify(persons));
    } catch (e) {
      console.error("Failed to save persons", e);
    }
  }, [persons]);

  function addTransaction(tx) {
    // resolve person to an id (case-insensitive match on name)
    if (tx.person) {
      const name = tx.person.trim();
      const lower = name.toLowerCase();
      let existing = persons.find((p) => p.name.toLowerCase() === lower);
      if (!existing) {
        // create new person
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        existing = { id, name };
        setPersons((prev) => [existing, ...prev]);
      }
      tx.personId = existing.id;
      tx.person = existing.name; // normalize
    }
    setTransactions((prev) => [tx, ...prev]);
  }

  function renamePerson(id, newName) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setPersons((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
    setTransactions((prev) => prev.map((t) => (t.personId === id ? { ...t, person: trimmed } : t)));
  }

  function mergePeople(sourceId, targetId) {
    if (!sourceId || !targetId || sourceId === targetId) return;
    // move transactions from source to target, remove source person
    setTransactions((prev) => prev.map((t) => (t.personId === sourceId ? { ...t, personId: targetId, person: (persons.find(p=>p.id===targetId)||{}).name || t.person } : t)));
    setPersons((prev) => prev.filter((p) => p.id !== sourceId));
  }

  function deletePerson(id) {
    if (!id) return;
    // remove person and all their transactions
    setPersons((prev) => prev.filter((p) => p.id !== id));
    setTransactions((prev) => prev.filter((t) => t.personId !== id));
  }

  function openPerson(personId) {
    // set filter so TransactionList shows only that person's transactions
    setTransactionFilterPersonId(personId);
    // also open people manager for quick actions optionally
    setShowPeopleManager(true);
  }

  function clearPersonFilter() {
    setTransactionFilterPersonId(null);
  }

  function togglePeopleManager(open) {
    setShowPeopleManager(typeof open === 'boolean' ? open : !showPeopleManager);
  }

  // expose for Dashboard quick buttons (keeps Dashboard decoupled)
  React.useEffect(() => {
    window._openPerson = openPerson;
    window._openPeopleManager = togglePeopleManager;
    return () => {
      delete window._openPerson;
      delete window._openPeopleManager;
    };
  }, [openPerson, togglePeopleManager]);

  function removeTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const n = Number(t.amount) || 0;
        if (t.type === "income") acc.income += n;
        else if (t.type === "expense") acc.expense += n;
        else if (t.type === "lend") acc.lend += n;
        else if (t.type === "borrow") acc.borrow += n;
        return acc;
      },
      { income: 0, expense: 0, lend: 0, borrow: 0 }
    );
  }, [transactions]);

  const personsMap = useMemo(() => {
    // start from persons array
    const map = {};
    persons.forEach((p) => {
      map[p.id] = { id: p.id, name: p.name, balance: 0, items: [] };
    });
    // aggregate transactions by personId
    transactions.forEach((t) => {
      if (!t.personId) return;
      if (!map[t.personId]) {
        // person created implicitly
        map[t.personId] = { id: t.personId, name: t.person || "(unknown)", balance: 0, items: [] };
      }
      const n = Number(t.amount) || 0;
      if (t.type === "lend") map[t.personId].balance += n;
      else if (t.type === "borrow") map[t.personId].balance -= n;
      map[t.personId].items.push(t);
    });
    return map;
  }, [persons, transactions]);

  return (
    <div className="container">
      <h1>Money Manager</h1>

      <div className="layout">
        <div className="left">
          <div className="card">
            <TransactionForm onAdd={addTransaction} persons={persons} />
          </div>

          <div className="card">
            <Dashboard transactions={transactions} personsMap={personsMap} />
          </div>
        </div>

        <div className="right">
          <div className="card">
            <PersonList persons={persons} transactions={transactions} personsMap={personsMap} selectedPersonId={transactionFilterPersonId} />
          </div>

          <div className="card">
            <TransactionList
              items={transactions}
              onRemove={removeTransaction}
              personsMap={personsMap}
              filterPersonId={transactionFilterPersonId}
              onClearFilter={clearPersonFilter}
            />
          </div>

          {showPeopleManager && (
            <div className="card">
              <PeopleManager
                persons={persons}
                onRename={renamePerson}
                onMerge={mergePeople}
                onDelete={deletePerson}
                onClose={() => setShowPeopleManager(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
