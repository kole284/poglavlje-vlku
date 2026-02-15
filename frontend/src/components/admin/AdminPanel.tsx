"use client";
import './adminPanel.scss';
import React, { useEffect, useState } from "react";

// Tip podataka za Knjigu
type Book = {
  id?: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<Book>({ title: "", author: "", price: 0, stock: 0 });
  const [message, setMessage] = useState<string | null>(null);
  
  // Stanje za autorizaciju (čita JWT token iz localStorage)
  const [auth, setAuth] = useState<boolean>(() => typeof window !== 'undefined' && !!localStorage.getItem('admin-token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Učitavanje knjiga tek nakon uspešne autorizacije
  useEffect(() => {
    if (auth) fetchBooks();
  }, [auth]);

  // Dobavljanje JWT tokena iz localStorage
  function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin-token');
  }

  // Funkcija za preuzimanje knjiga (GET)
  async function fetchBooks() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/books`);
      const data = await res.json();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
      setMessage("Greška pri učitavanju knjiga.");
    } finally {
      setLoading(false);
    }
  }

  // Postavlja knjigu za izmenu
  function startEdit(b: Book) {
    setEditing(b);
    setForm({ ...b });
    setMessage(null);
  }

  // Resetuje formu
  function resetForm() {
    setEditing(null);
    setForm({ title: "", author: "", price: 0, stock: 0 });
    setMessage(null);
  }

  // Funkcija za dodavanje (POST) ili ažuriranje (PUT) knjige
  async function submitBook(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        setMessage("Niste autorizovani.");
        setAuth(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      if (editing && editing.id) {
        // AŽURIRANJE (PUT)
        const res = await fetch(`${API_BASE}/books/${editing.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(form),
        });
        
        if (res.status === 401) {
          setMessage("Sesija je istekla. Prijavite se ponovo.");
          localStorage.removeItem('admin-token');
          setAuth(false);
          return;
        }
        
        if (res.ok) {
          setMessage("Knjiga je ažurirana.");
        } else {
          setMessage("Greška pri ažuriranju.");
        }
      } else {
        // KREIRANJE (POST)
        const res = await fetch(`${API_BASE}/books`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(form),
        });
        
        if (res.status === 401) {
          setMessage("Sesija je istekla. Prijavite se ponovo.");
          localStorage.removeItem('admin-token');
          setAuth(false);
          return;
        }
        
        if (res.ok) {
          setMessage("Knjiga je kreirana.");
        } else {
          setMessage("Greška pri kreiranju.");
        }
      }
      
      await fetchBooks();
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage("Greška pri čuvanju knjige.");
    }
  }

  // Funkcija za brisanje (DELETE) knjige
  async function deleteBook(id?: number) {
    const token = getToken();
    if (!token) {
      setMessage("Niste autorizovani.");
      setAuth(false);
      return;
    }
    
    if (!id) return;
    if (!confirm("Da li ste sigurni da želite obrisati knjigu?")) return;
    
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        setMessage("Sesija je istekla. Prijavite se ponovo.");
        localStorage.removeItem('admin-token');
        setAuth(false);
        return;
      }
      
      if (res.ok) {
        await fetchBooks();
        setMessage("Knjiga obrisana.");
      } else {
        setMessage("Greška pri brisanju knjige.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Greška pri brisanju knjige.");
    }
  }

  // Funkcija za prijavu sa backend autentifikacijom
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username: username,
          password: password 
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin-token', data.token);
        setAuth(true);
        setPassword('');
        setUsername('');
        setMessage('Uspešna prijava.');
      } else {
        const error = await res.json();
        setMessage(error.message || 'Pogrešna lozinka.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Greška pri povezivanju sa serverom.');
    }
  }

  if (!auth) {
    return (
    <div className='admin-wrapper'>
      <div className='admin-container auth-container'>
        <div className="admin-panel auth-panel">
            <div className="auth-header">
              <div className="auth-icon">🔐</div>
              <h2>Admin Panel</h2>
              <p className="auth-subtitle">Prijavite se da upravljate knjigama</p>
            </div>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="input-group">
                <div className="input-icon">👤</div>
                <input 
                  type="text" 
                  placeholder="Korisničko ime" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <div className="input-icon">🔑</div>
                <input 
                  type="password" 
                  placeholder="Lozinka" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="admin-login-actions">
                  <button type="submit">Prijavi se</button>
              </div>
            </form>
            {message && <div className={`admin-message ${message.includes('Uspešna') ? 'success' : 'error'}`}>{message}</div>}
        </div>
      </div>
    </div>
    );
  }

  // 2. Glavni Admin Panel (ako je autorizovan)
  return (
    <div className='admin-wrapper'>
      <div className='admin-container'>
        <div className="admin-panel">
          <div className="admin-header">
            <h1>Admin panel</h1>
            <div className="admin-actions">
              <button onClick={() => { 
                localStorage.removeItem('admin-token'); 
                setAuth(false); 
                setMessage('Odjavljeni ste.'); 
              }}>Odjavi se</button>
            </div>
          </div>

          {message && <div className="admin-message">{message}</div>}

          <div className="admin-body">
            <aside className="admin-form">
              <h3>{editing ? 'Ažuriraj knjigu' : 'Dodaj knjigu'}</h3>
              <form onSubmit={submitBook} className="admin-book-form">
                <input placeholder="Naslov" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <input placeholder="Autor" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
                <input placeholder="Slika (URL)" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                <textarea placeholder="Opis" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input type="number" placeholder="Cena" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                <input type="number" placeholder="Stanje" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
                <div className="admin-form-actions">
                  <button type="submit">{editing ? 'Sačuvaj izmene' : 'Kreiraj knjigu'}</button>
                  <button type="button" onClick={resetForm}>Poništi</button>
                </div>
              </form>
            </aside>

            <section className="admin-list">
              <h3>Lista Knjiga ({books.length})</h3>
              {loading ? <div>Učitavanje...</div> : (
                <div className="admin-books-grid">
                  {books.map(b => (
                    <article className="admin-book" key={b.id}>
                      <div className="admin-book-image">{b.imageUrl ? <img src={b.imageUrl} alt={b.title} /> : null}</div>
                      <div className="admin-book-meta">
                        <div className="admin-book-title">{b.title}</div>
                        <div className="admin-book-author">od: {b.author}</div>
                        <div className="admin-book-price">{b.price} RSD • Zaliha: {b.stock}</div>
                      </div>
                      <div className="admin-book-actions">
                        <button onClick={() => startEdit(b)}>Uredi</button>
                        <button onClick={() => deleteBook(b.id)}>Obriši</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}