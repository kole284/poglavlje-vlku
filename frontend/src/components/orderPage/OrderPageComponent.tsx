"use client";

import React, { useEffect, useState } from 'react';
import OrderCard from '../orderCard/OrderCard';
import './orderPageComponent.scss';

type Book = {
  id?: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5049';

export default function OrderPageComponent(){
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => { fetchBooks() }, []);

    async function fetchBooks(){
        try{
            const res = await fetch(`${API_BASE}/books`);
            const data = await res.json();
            setBooks(data || []);
        }catch(err){
            console.error(err);
        }
    }

    return(
        <div className="orderPage-background">
            <div className='card-container'>
                {books.map(b => (
                    <OrderCard key={b.id} book={b} />
                ))}
            </div>
        </div>
    )
}
