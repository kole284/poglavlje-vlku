import './footer.scss';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa6';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* SEKCIJA 1: Naslov + Logo pored, Paragraf ispod */}
                <div className="footer-section-1">
                    <div className="title-logo-wrapper">
                        <h3>Poglavlje <span className='text-highlight'>Vlku</span></h3>
                        <Image 
                            src={logo} 
                            alt="Logo" 
                            width={75} 
                            height={75} 
                            style={{ objectFit: 'contain' }}
                        />
                    </div>                    
                    <p>Tvoj novi <span className='text-highlight'>omiljeni</span> srpski pisac</p>
                </div>

                {/* SEKCIJA 2: Linkovi */}
                <div className="footer-section-2">
                    <h3>Linkovi</h3>
                    <ul>
                        <li><a href="/">Početna</a></li>
                        <li><a href="/about">O autoru</a></li>
                        <li><a href="/books">Knjige</a></li>
                        <li><a href="/order">Poruči</a></li>
                        <li><a href="/cart">Korpa</a></li>
                    </ul>
                </div>

                {/* SEKCIJA 3: Social */}
                <div className="footer-section-3">
                    <h4>Prati nas</h4>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/vlku.stefan" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="icon" />
                        </a>
                        
                        <a href="https://www.instagram.com/poglavlje_vlku/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="icon" />
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Poglavlje Vlku. Sva prava zadržana.</p>
            </div>
        </footer>
    );
}