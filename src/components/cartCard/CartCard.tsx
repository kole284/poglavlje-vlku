import './cartCard.scss';
import Image from 'next/image';
export default function CartCard(){
    return(
        <div className="card-container">
            <Image
                      src='/images/knjiga-stojeci.png'
                      alt="Naslovna slika knjige"
                      width={250} // Prilagodite širinu po potrebi
                      height={350} // Prilagodite visinu po potrebi
                      priority
                      className='card-image'
            />
            <div className='cart-content'>
                <p className='book-title'>Naslov knjige</p>
                <p className='book-price'>Cena: <span className='price-highlight'>900.00</span> rsd</p>
                <div className='quantity'>
                    <div className='minus'>-</div>
                    <div className='number'>1</div>
                    <div className='plus'>+</div>
                </div>
            </div>
        </div>
    )
}