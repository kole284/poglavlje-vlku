import Image from 'next/image';
import './booksPageCard.scss';
import Button from '../button/Button';

// TypeScript interfejs za propove
interface CardProps {
  bookImage1: string; // URL naslovne slike
  bookText: string; // URL slike autora/avatara
  bookImage2: string; // Tekst za opis knjige
}

export default function BooksPageCard({ bookImage1, bookImage2, bookText }: CardProps) {
  return (
    <div className="book-card">
      <div className="image1">
        <Image
          src={bookImage1}
          alt="Naslovna slika knjige"
          width={250} // Prilagodite širinu po potrebi
          height={350} // Prilagodite visinu po potrebi
          priority
        />
      </div>
      <div className='text'>
         <p className="description">
          {bookText}
        </p>
      </div>
       
        
        <div className="image2">
          <Image
            src={bookImage2}
            alt="Slika autora"
            width={60}
            height={60}
          />
          <Button route='/home' text='Poruči'/>
        </div>
    </div>
  );
}