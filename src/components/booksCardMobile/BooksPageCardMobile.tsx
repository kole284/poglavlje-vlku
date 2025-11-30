import Image from 'next/image';
import './booksPageCardMobile.scss';
import Button from '../button/Button';

interface CardProps {
  bookImage1: string;
  bookText: string;
  bookImage2: string;
}

export default function BooksPageCard({ bookImage1, bookImage2, bookText }: CardProps) {
  return (
    <div className="book-card-mobile">
      <div className="image-mobile">
        <Image
          src={bookImage1}
          alt="Naslovna slika knjige"
          width={250}
          height={350}
          priority
        />
      </div>
        <div className="text-mobile">
            <p className="description-mobile">
                {bookText}
            </p>
        </div>
    </div>
  );
}