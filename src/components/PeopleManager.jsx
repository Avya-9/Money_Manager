import React, { useState } from "react";

export default function PeopleManager({ persons, onRename, onMerge, onDelete, onClose }) {
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [mergeFrom, setMergeFrom] = useState("");
  const [mergeTo, setMergeTo] = useState("");

  function startEdit(p) {
    setEditing(p.id);
    setName(p.name);
  }

  function saveEdit() {
    if (editing && name.trim()) {
      const ok = window.confirm(`Rename "${(persons.find(pp=>pp.id===editing)||{}).name || ''}" to "${name.trim()}"?`);
      if (ok) onRename(editing, name.trim());
    }
    setEditing(null);
    setName("");
  }

  function doMerge() {
    if (mergeFrom && mergeTo && mergeFrom !== mergeTo) {
      const fromName = (persons.find(p=>p.id===mergeFrom)||{}).name || mergeFrom;
      const toName = (persons.find(p=>p.id===mergeTo)||{}).name || mergeTo;
      const ok = window.confirm(`Merge "${fromName}" into "${toName}"? This will move all transactions and remove "${fromName}".`);
      if (ok) onMerge(mergeFrom, mergeTo);
    }
    setMergeFrom("");
    setMergeTo("");
  }

  if (!persons || !persons.length) return <div className="empty">No people to manage.</div>;

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <h3 style={{margin:0}}>Manage People</h3>
        {onClose && <button style={{marginLeft:'auto'}} onClick={onClose}>Close</button>}
      </div>
      <ul className="person-list">
        {persons.map((p) => (
          <li key={p.id} className="person-item">
            <div>
              {editing === p.id ? (
                <input value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                <div className="person-name">{p.name}</div>
              )}
            </div>
            <div style={{display: 'flex', gap: 8}}>
              {editing === p.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(p)}>Rename</button>
                  <button onClick={() => {
                    if (window.confirm(`Delete "${p.name}"? This will also delete all transactions for this person.`)) {
                      onDelete(p.id);
                    }
                  }} style={{background: '#ef4444', color: '#fff'}}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div style={{marginTop:12}}>
        <h4>Merge People</h4>
        <div className="row">
          <label>From</label>
          <select value={mergeFrom} onChange={(e)=>setMergeFrom(e.target.value)}>
            <option value="">Select</option>
            {persons.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="row">
          <label>Into</label>
          <select value={mergeTo} onChange={(e)=>setMergeTo(e.target.value)}>
            <option value="">Select</option>
            {persons.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="row actions">
          <button onClick={doMerge}>Merge</button>
        </div>
      </div>
    </div>
  );
}
