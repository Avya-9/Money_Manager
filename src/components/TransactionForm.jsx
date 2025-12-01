import React, { useState, useRef } from "react";

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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
      image: image,
    };
    onAdd(tx);
    setTitle("");
    setAmount("");
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // keep date/type/person to allow adding multiple items quickly
    // setDate(today);
    // setType("expense");
    // setPerson("");
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        setImage(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      <div className="row">
        <label>Picture (Optional)</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div style={{marginTop: '8px'}}>
            <img src={imagePreview} alt="preview" style={{maxWidth: '100%', maxHeight: '150px', borderRadius: '8px'}} />
            <div style={{marginTop: '8px', display: 'flex', gap: '8px'}}>
              <button type="button" onClick={clearImage} style={{padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all .12s ease'}}>
                Remove Image
              </button>
            </div>
          </div>
        )}
      </div>

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
