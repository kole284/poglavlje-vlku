import Image from 'next/image';
import Button from '../button/Button';
import './orderCard.scss';
export default function OrderCard(){
    return(
        <div className="orderCard-container">
            <div className="orderCard-image-container">
                 <Image
                          src="/images/knjiga-stojeci.png"
                          alt="Naslovna slika knjige"
                          width={100} // Prilagodite širinu po potrebi
                          height={200} // Prilagodite visinu po potrebi
                          priority
                        />
            </div>
            <div className="orderCard-content">
                <h2 className="orderCard-title">Bogatir</h2>
                <p className="orderCard-price">900.00 rsd</p>
            </div>
            <Button route="/home "text="Kupi" />
        </div>
    )
};