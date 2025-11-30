'use client'; 
import { useState, useEffect } from 'react';
import BooksPageCard from '../booksCard/BooksPageCard';
import Image from 'next/image'; 
import './booksPageComponent.scss';

import BooksPageCardMobile from '../booksCardMobile/BooksPageCardMobile'; 

const bookData = [
    { 
        id: 1, 
        image1: '/images/knjiga-stojeci.png', 
        image2: '/images/knjiga-lezeci.png', 
        text: 'Knjiga 1 (Desktop i Mobilni): Prvi deo priče. Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, aliquid ullam! Odit molestias autem officiis culpa placeat tenetur aspernatur in molestiae...'
    },
    { 
        id: 2, 
        image1: '/images/knjiga-stojeci.png', 
        image2: '/images/knjiga-lezeci.png', 
        text: 'Knjiga 2 (Desktop i Mobilni): Drugi deo avanture. Odit molestias autem officiis culpa placeat tenetur aspernatur in molestiae, veritatis itaque ea sit ipsam...'
    },
    { 
        id: 3, 
        image1: '/images/knjiga-stojeci.png', 
        image2: '/images/knjiga-lezeci.png', 
        text: 'Knjiga 3 (Desktop i Mobilni): Veliko finale! Doloribus, aliquid ullam! Odit molestias autem officiis culpa placeat tenetur aspernatur in molestiae...'
    },
];

const MOBILE_BREAKPOINT = 768;

export default function BooksPageComponent(){
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const goToPrev = () => {
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? bookData.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLast = currentIndex === bookData.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (!isMobile) {
        return (
            <div className='booksPage-background'>
                <div className='card-container'>
                    {bookData.map((book) => (
                        <BooksPageCard 
                            key={book.id}
                            bookImage1={book.image1} 
                            bookImage2={book.image2} 
                            bookText={book.text}
                        />
                    ))}
                </div>
            </div>
        );
    }
    
    const ActiveCardComponent = BooksPageCardMobile; 

    return(
        <div className='booksPage-background'>
            <div className='card-container-mobile'>
                
                <div className='card-wrapper'>
                    <ActiveCardComponent 
                        bookImage1={bookData[currentIndex].image1} 
                        bookImage2={bookData[currentIndex].image2} 
                        bookText={bookData[currentIndex].text}
                    />
                </div>

                <div className="carousel-controls">
                    <button className='arrow-button left' onClick={goToPrev} aria-label="Prethodna knjiga">
                        {/* Možete koristiti Image komponentu ako imate SVG */}
                        <span className="arrow-icon">{'<'}</span> 
                    </button>
                    
                    {/* Opciono: Prikaz trenutnog broja/indikatora */}
                    <div className="slide-indicator">
                        {currentIndex + 1} / {bookData.length}
                    </div>

                    <button className='arrow-button right' onClick={goToNext} aria-label="Sledeća knjiga">
                        <span className="arrow-icon">{'>'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}