'use client';

import Image from 'next/image';
import './orderCard.scss';
import { addToCart } from '../../lib/cart';
import Button from '../button/Button';

type BookProp = {
  book: {
    id?: number;
    title: string;
    author?: string;
    price: number;
    imageUrl?: string;
  }
}

export default function OrderCard({ book }: BookProp){
    const handleAdd = () => {
        if (!book.id) return;
        addToCart({ bookId: book.id, title: book.title, price: book.price, quantity: 1, imageUrl: book.imageUrl });
        const ev = new CustomEvent('pv:add-to-cart', { detail: { title: book.title } });
        window.dispatchEvent(ev);
    }

    return(
        <div className="orderCard-container">
            <div className="orderCard-image-container">
                {book.imageUrl && <img src={book.imageUrl} alt={book.title}/>}
            </div>
            <div className="orderCard-content">
                <h2 className="orderCard-title">{book.title}</h2>
                <p className="orderCard-price"><span className='price-highlight'>{book.price.toFixed(2)}</span> rsd</p>
            </div>
            <Button text='Kupi' onClick={handleAdd}/>
        </div>
    )
};