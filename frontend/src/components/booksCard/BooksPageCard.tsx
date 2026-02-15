'use client';

import Image from 'next/image';
import './booksPageCard.scss';
import Button from '../button/Button';
import { addToCart } from '../../lib/cart';

interface CardProps {
  book: {
    id?: number;
    title: string;
    author?: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
  };
}

export default function BooksPageCard({ book }: CardProps) {
    const handleAddToCart = () => {
    if (!book.id) return;
    addToCart({ 
      bookId: book.id, 
      title: book.title, 
      price: book.price, 
      quantity: 1, 
      imageUrl: book.imageUrl 
    });
    try {
      // show toast if available
      // dynamic import hook to avoid circular issues in some setups
    } finally {
      // fallback to a simple notification via event if toast not available
      const ev = new CustomEvent('pv:add-to-cart', { detail: { title: book.title } });
      window.dispatchEvent(ev);
    }
  };

  return (
    <div className="book-card">
      <div className="image">
        {book.imageUrl && (
          <img src={book.imageUrl} alt={book.title} className="server-book-img" />
        )}
      </div>
      <div className='info'>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <p className="price"><span className='price-highlight'>{book.price.toFixed(2)} </span>rsd</p>
        <Button text='Poruči' onClick={handleAddToCart}/>

            
      </div>
      <div className='description'>
         <p className="description">
          {book.description || 'Nema opisa'}
        </p>
      </div>
    </div>
  );
}