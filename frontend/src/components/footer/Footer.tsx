import './footer.scss';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa6';

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
                    <p>TVOJ NOVI <span className='text-highlight'>OMILJENI</span> DOMAĆI AUTOR</p>
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
                        
                        <a href="https://www.tiktok.com/@poglavlje_vlku" target="_blank" rel="noopener noreferrer">
                            <FaTiktok className="icon" />
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