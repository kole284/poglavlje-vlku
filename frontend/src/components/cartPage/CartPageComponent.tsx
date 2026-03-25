"use client";

import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import CartCard from '../cartCard/CartCard';
import './cartPageComponent.scss';
import { getCart, updateQuantity, removeFromCart, clearCart, CartItem } from '../../lib/cart';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5002';

export default function CartPageComponent(){
    const [items, setItems] = useState<CartItem[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => { setItems(getCart()) }, []);

    function refresh(){ setItems(getCart()) }

    function handleUpdate(bookId: number, qty: number){
        updateQuantity(bookId, qty);
        refresh();
    }

    function handleRemove(bookId: number){
        removeFromCart(bookId);
        refresh();
    }

    function computeTotals(){
        const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
        return { subtotal };
    }

    async function handleCheckout(e: React.FormEvent){
        e.preventDefault();
        if (items.length === 0) { setMessage('Korpa je prazna'); return; }
        setLoading(true);
        try{
            // create purchase per item
            for(const it of items){
                const res = await fetch(`${API_BASE}/api/purchases`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookId: it.bookId, quantity: it.quantity, buyerName: name, buyerEmail: email })
                });
                if (!res.ok) throw new Error(await res.text());
            }
            clearCart();
            refresh();
            setMessage('Narudžbina uspješna');
            setName(''); setEmail('');
        }catch(err:any){
            console.error(err);
            setMessage('Greška pri slanju narudžbine: ' + (err?.message || ''));
        }finally{ setLoading(false) }
    }

    const totals = computeTotals();

    return(
        <div className="cartPage-background">
            <div className='cartPage-container'>
                <div className='left-section'>
                    <div className='text-container'>
                        <p className='cart'>Korpa</p>
                        <p className='price'>Ukupno: <span className='price-highlight'>{totals.subtotal.toFixed(2)}</span> rsd</p>
                    </div>
                    <div className='items-container'>
                        {items.length === 0 ? <div style={{padding:20}}><span className='empty-cart'>Korpa je prazna</span></div> : items.map(i => (
                            <CartCard key={i.bookId} item={i} onRemove={handleRemove} onUpdate={handleUpdate} />
                        ))}
                    </div>
                </div>
                <div className='right-section'>
                    <div className='info'>
                        <div className='costs'>
                            <p>Ukupno: <span className='price-highlight'>{totals.subtotal.toFixed(2)}</span> rsd</p>
                            <p className='shipping-note'>*Poštarina se dodatno naplaćuje</p>
                        </div>
                        <div className='summary'>
                            <Button route="/checkout" text='Nastavi' disabled={items.length === 0}/>
                        </div>
                    </div>

                </div>
            </div>
            {message && <div style={{position:'fixed',right:12,bottom:12,background:'#000',padding:12,borderRadius:8}}>{message}</div>}
        </div>
    )
}