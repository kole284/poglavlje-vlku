'use client'

import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import './checkoutPageComponent.scss';
import { getCart, clearCart, CartItem } from '../../lib/cart';
import { useToast } from '@/components/toast/ToastProvider';

// 💡 UVOZ PODATAKA: Uvozimo ravnu listu opština iz JSON-a
import opstineData from '@/app/data/opstine.json'; 
import postanski from '@/app/data/postanski_brojevi_srbija.json';

// Pretvaramo listu opština iz JSON objekta u niz stringova
const sveOpstine: string[] = opstineData.opstine as string[];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5049';

export default function CheckoutPageComponent(){
    const [items, setItems] = useState<CartItem[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartment, setApartment] = useState('');
    
    // 💡 PROMENA 1: Inicijalizacija na prazan string, da bi se izabrala default opcija
    const [municipality, setMunicipality] = useState('');
    
    const [city, setCity] = useState(''); 
    const [zip, setZip] = useState('');

    const cityList = React.useMemo(() => {
        try{
            const arr = (postanski as Array<{ mesto: string; postanski_broj: string }>).map(x => ({ mesto: x.mesto, zip: x.postanski_broj }));
            const seen = new Set<string>();
            const out: { mesto: string; zip: string }[] = [];
            for (const a of arr){
                const k = `${a.mesto}::${a.zip}`;
                if (!seen.has(k)) { seen.add(k); out.push(a); }
            }
            out.sort((a,b)=> a.mesto.localeCompare(b.mesto, 'sr'));
            return out;
        }catch{
            return [];
        }
    }, []);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => { 
        setItems(getCart()) 
        // Ako je municipality prazan string, a lista opstina nije, i dalje će biti izabran default placeholder.
        if (sveOpstine.length > 0 && municipality === '') {
            // Ostavljamo prazan string da bi placeholder bio izabran
        }
    }, []);

    function computeTotals(){
        const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
        return { subtotal };
    }

    const toast = useToast();

    function validateEmailAddress(em: string){
        const v = em.trim();
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v);
    }

    function validateFullName(n: string){
        const parts = n.trim().split(/\s+/);
        if (parts.length < 2) return false;
        for (const p of parts.slice(0,2)){
            if (p.length < 3) return false;
            if (!/^[A-Za-zŠĐČĆŽšđčćž'-]+$/.test(p)) return false;
        }
        return true;
    }

    function validatePhoneNumber(ph: string){
        const s = ph.replace(/\s+/g, '');
        if (!s) return false;
        if (!s.startsWith('06')) return false;
        if (!/^\d+$/.test(s)) return false;
        return true;
    }

    async function handleSubmit(e?: React.FormEvent){
        if (e) e.preventDefault();
        if (items.length === 0) { setMessage('Korpa je prazna'); toast.showToast('Korpa je prazna', 'error'); return; }
        if (!name || !email || !municipality || !city) { 
            const msg = 'Popunite sva obavezna polja (Ime, Email, Opština, Grad)';
            setMessage(msg); toast.showToast(msg, 'error');
            return; 
        }

        if (!street || !houseNumber) {
            const msg = 'Popunite obavezna polja: ulica i broj.';
            setMessage(msg); toast.showToast(msg, 'error');
            return;
        }

        if (!validateFullName(name)){
            const msg = 'Ime i prezime moraju biti najmanje dve reči, svaka od najmanje 3 slova.';
            setMessage(msg); toast.showToast(msg, 'error'); return;
        }

        if (!validateEmailAddress(email)){
            const msg = 'Unesite ispravan email.';
            setMessage(msg); toast.showToast(msg, 'error'); return;
        }

        if (phone && !validatePhoneNumber(phone)){
            const msg = 'Telefon mora počinjati sa 06 i sadržati samo cifre.';
            setMessage(msg); toast.showToast(msg, 'error'); return;
        }
        
        setLoading(true);
        try{
            for(const it of items){
                const res = await fetch(`${API_BASE}/api/purchases`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                       bookId: it.bookId, 
                       quantity: it.quantity, 
                       totalPrice: (it.price * it.quantity),
                       buyerName: name, 
                       buyerEmail: email,
                       street, houseNumber, apartment,
                       municipality: municipality, 
                       city: city, 
                       zip, phone 
                    })
                });
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || 'Purchase failed');
                }
            }
            clearCart();
            setItems([]);
            setMessage('');
            toast.showToast('Narudžbina uspešno poslata', 'success');
        }catch(err:any){
            console.error(err);
            const msg = 'Greška pri slanju narudžbine: ' + (err?.message || '');
            setMessage(msg);
            toast.showToast(msg, 'error');
        }finally{ setLoading(false) }
    }

    const totals = computeTotals();

    return(
        <div className="checkoutPage-background">
            <div className='checkout-container'>
                <form className='checkout-form' onSubmit={handleSubmit}>
                    <h2>Podaci za naplatu</h2>
                    
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ime i prezime" required />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email adresa" required />
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="Telefon" />
                    <input value={street} onChange={e => setStreet(e.target.value)} type="text" placeholder="Ulica" />
                    <input value={houseNumber} onChange={e => setHouseNumber(e.target.value)} type="text" placeholder="Broj" />
                    <input value={apartment} onChange={e => setApartment(e.target.value)} type="text" placeholder="Broj stana (opciono)" />
                    
                    {/* 💡 PROMENA 2: Dodata default option sa value="" */}
                    <select 
                        value={municipality} 
                        onChange={e => setMunicipality(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Izaberite opštinu</option>
                        {sveOpstine.map(opstina => (
                            <option key={opstina} value={opstina}>{opstina}</option>
                        ))}
                    </select>
                    
                    <select value={city ? `${city}||${zip}` : ''} onChange={e => {
                        const v = e.target.value;
                        // value is formatted as "mesto||zip"
                        const [mesto, pzip] = v.split('||');
                        setCity(mesto || '');
                        setZip(pzip || '');
                    }} required>
                        <option value="" disabled>Izaberite grad / naselje</option>
                        {cityList.map(c => (
                            <option key={`${c.mesto}::${c.zip}`} value={`${c.mesto}||${c.zip}`}>{c.mesto} — {c.zip}</option>
                        ))}
                    </select>

                    <input value={zip} readOnly type="text" placeholder="Poštanski broj" />
                    
                    <div className='button-container' style={{marginTop:12}}>
                        <Button text={loading ? 'Slanje...' : 'Pošalji narudžbinu'} onClick={handleSubmit} />
                    </div>
                </form>
                
                <div className='info-container'>
                    <h2>Pregled narudžbine</h2>
                    <div className='info-item'>
                        <p>Ukupno: <span className='text-highlight'>{totals.subtotal.toFixed(2)}</span> rsd</p>
                    </div>
                    <div className='info-item shipping-note'>
                        <p style={{fontSize: '1.4rem', fontStyle: 'italic', opacity: 0.85}}>*Poštarina se dodatno naplaćuje</p>
                    </div>
                    <div className='info-item contact-note'>
                        <p style={{fontSize: '1.3rem', marginTop: '1rem', opacity: 0.9}}>U slučaju problema kontaktirajte nas na <a href="https://www.instagram.com/poglavlje_vlku/" target="_blank" rel="noopener noreferrer" style={{color: '#d32f2f', textDecoration: 'underline'}}>Instagramu</a></p>
                    </div>
                    {message && <div style={{marginTop:12,color:'#fff'}}>{message}</div>}
                </div>
            </div>
        </div>
    )
}