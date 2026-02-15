'use client'; 

import './navbar.scss';
import Image from 'next/image';
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'
interface NavItem {
    name: string;
    href: string; 
}

export default function Navbar() {
    const currentPath = usePathname();
    const navItems: NavItem[] = [
        { name: 'Početna', href: '/home' }, 
        { name: 'O autoru', href: '/about' }, 
        { name: 'Knjige', href: '/books' }, 
        { name: 'Poruči', href: '/order' }, 
    ];

    const getLinkClassName = (href: string): string => {
        const normalizedCurrentPath = currentPath === '/' ? '/startPage' : currentPath;
        
        // Poredimo normiranu putanju sa datim href-om
        return normalizedCurrentPath === href ? 'active-link' : '';
    };

    return (
        <div className="navbar">
            <Image 
                className='logo'
                src="/images/logo.png" 
                alt="Logo" 
                width={70} 
                height={60}
                priority
            />

            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    // Poziv funkcije sa item.href, koja je definisana kao string
                    className={getLinkClassName(item.href)} 
                >
                    {item.name}
                </Link>
            ))}

            {/* Cart icon switches to active when currentPath === '/cart' */}
            <Link
                href="/cart"
                className={currentPath === '/cart' ? 'cart-link active' : 'cart-link'}
                aria-label="Korpa - otvori korpu"
                aria-current={currentPath === '/cart' ? 'page' : undefined}
            >
                <Image
                    className='cart'
                    src={currentPath === '/cart' ? '/images/cart-active.svg' : '/images/cart.svg'}
                    alt={currentPath === '/cart' ? 'Korpa (trenutna)' : 'Korpa'}
                    width={50}
                    height={50}
                    priority
                />
            </Link>
        </div>
    );
}