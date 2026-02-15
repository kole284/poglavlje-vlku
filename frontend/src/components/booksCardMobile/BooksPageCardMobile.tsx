import Image from 'next/image';
import './booksPageCardMobile.scss';
import Button from '../button/Button';
import { addToCart } from '../../lib/cart';

interface Book {
  id?: number;
  title: string;
  author?: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface CardProps {
  book: Book;
}

export default function BooksPageCardMobile({ book }: CardProps) {
  const handleAdd = () => {
    if (!book.id) return;
    addToCart({ bookId: book.id, title: book.title, price: book.price, quantity: 1, imageUrl: book.imageUrl });
    const ev = new CustomEvent('pv:add-to-cart', { detail: { title: book.title } });
    window.dispatchEvent(ev);
  };

  return (
    <div className="book-card-mobile">
      <div className="image-mobile">
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} />
        ) : (
          <Image src="/images/knjiga-stojeci.png" alt={book.title} width={250} height={350} priority />
        )}
      </div>

      <div className="text-mobile">
        <h3 className="title">{book.title}</h3>
        {book.author && <p className="author">{book.author}</p>}
        <p className="description-mobile">{book.description || 'Nema opisa'}</p>
        <p className="price"><span className='price-highlight'>{(book.price ?? 0).toFixed(2)} </span>rsd</p>
      </div>

      <div className="action-mobile">
        <div className="actions-right">
          <Button text="Dodaj u korpu" onClick={handleAdd} />
        </div>
      </div>
    </div>
  );
}