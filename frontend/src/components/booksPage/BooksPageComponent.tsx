'use client'; 
import { useState, useEffect } from 'react';
import BooksPageCard from '../booksCard/BooksPageCard';
import Image from 'next/image'; 
import './booksPageComponent.scss';

import BooksPageCardMobile from '../booksCardMobile/BooksPageCardMobile'; 

type Book = {
  id?: number;
  title: string;
  author?: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

// Compute API base: prefer NEXT_PUBLIC_API_BASE (set in .env.local or hosting),
// otherwise when running in browser try to reach backend on the host's LAN
// IP at port 5049 (http) or 7200 (https) so phone can access dev API.
const RAW_ENV_API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const API_BASE = RAW_ENV_API_BASE && RAW_ENV_API_BASE !== '' ? RAW_ENV_API_BASE.replace(/\/$/, '') : '';
const MOBILE_BREAKPOINT = 768;

export default function BooksPageComponent(){
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchBooks();
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    async function fetchBooks() {
    try {
        const candidates: string[] = [];
        
        // 1. Ako si postavio nešto u .env.local
        if (API_BASE) candidates.push(`${API_BASE}/books`);

        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            
            // 2. KLJUČ: Ako pristupaš preko telefona koji je na Wireless Debugging-u,
            // 'localhost' na telefonu će postati 'localhost' na laptopu zahvaljujući ADB-u.
            candidates.push(`http://localhost:5049/api/books`);
            
            // 3. Backup: koristi trenutni hostname (ako pristupaš preko IP adrese)
            if (host !== 'localhost') {
                candidates.push(`http://${host}:5049/api/books`);
            }
        }

        let lastErr: any = null;
        for (const url of candidates) {
            try {
                // Dodajemo timeout da ne bismo čekali predugo na loše kandidate
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const res = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                const data = await res.json();
                setBooks(data || []);
                return; // Uspešno povučeno!
            } catch (e) {
                lastErr = e;
                console.warn(`Attempt failed for ${url}:`, e);
            }
        }
        throw lastErr;
    } catch (err) {
        console.error('Error fetching books:', err);
    }
}

    const goToPrev = () => {
        if (!books.length) return;
        const isFirst = currentIndex === 0;
        const newIndex = isFirst ? books.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        if (!books.length) return;
        const isLast = currentIndex === books.length - 1;
        const newIndex = isLast ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // Allow rendering page even when books are not yet loaded so
    // mobile card + arrows are visible; show placeholder content.

    if (!isMobile) {
        return (
            <div className='booksPage-background'>
                <div className='card-container'>
                    {books.map((book) => (
                        <BooksPageCard 
                            key={book.id}
                            book={book}
                        />
                    ))}
                </div>
            </div>
        );
    }
    
    const ActiveCardComponent = BooksPageCardMobile;
    const placeholderBook: Book = {
        id: undefined,
        title: 'Učitavanje...',
        author: undefined,
        description: 'Učitavanje knjiga sa servera. Proveri konekciju ili osveži stranicu.',
        price: 0,
        stock: 0,
        imageUrl: '/images/knjiga-stojeci.png'
    };
    const currentBook = books.length ? books[currentIndex] : placeholderBook;

    return(
        <div className='booksPage-background'>
            <div className='card-container-mobile'>
                
                <div className='card-wrapper'>
                    <ActiveCardComponent
                        key={currentBook.id ?? 'placeholder'}
                        book={currentBook}
                    />
                </div>

                <div className="carousel-controls">
                    <button className='arrow-button left' onClick={goToPrev} aria-label="Prethodna knjiga">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    
                    <div className="slide-indicator">
                        {currentIndex + 1} / {books.length}
                    </div>

                    <button className='arrow-button right' onClick={goToNext} aria-label="Sledeća knjiga">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}