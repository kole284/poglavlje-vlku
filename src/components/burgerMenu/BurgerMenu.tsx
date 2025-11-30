'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import './burgerMenu.scss';

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Sakrivanje skrolovanja kada je meni otvoren
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };

  return (
    <div className="mobile-only">
      {/* Burger Dugme */}
      <button 
        className={`burger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </button>

      {/* Meni Panel */}
      <nav className={`mobile-menu ${isOpen ? 'visible' : ''}`}>
        {/* Logo u levom gornjem ćošku */}
        <div className="menu-logo">
          <Image 
            src="/images/logo.png" 
            alt="Logo" 
            width={120} 
            height={60}
            priority
          />
        </div>

        {/* Navigacioni linkovi */}
        <div className="menu-links">
          <a 
            href="/home" 
            onClick={toggleMenu}
            className={pathname === '/home' ? 'active' : ''}
          >
            Početna
          </a>
          <a 
            href="/about" 
            onClick={toggleMenu}
            className={pathname === '/about' ? 'active' : ''}
          >
            O nama
          </a>
          <a 
            href="/books" 
            onClick={toggleMenu}
            className={pathname === '/books' ? 'active' : ''}
          >
            Knjige
          </a>
           <a 
            href="/order" 
            onClick={toggleMenu}
            className={pathname === '/order' ? 'active' : ''}
          >
            Poruči
          </a>
           <a 
            href="/cart" 
            onClick={toggleMenu}
            className={pathname === '/cart' ? 'active' : ''}
          >
            Korpa
          </a>
        </div>
      </nav>
    </div>
  );
}