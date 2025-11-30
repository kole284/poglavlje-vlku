import Button from '../button/Button';
import CartCard from '../cartCard/CartCard';
import './cartPageComponent.scss';
export default function CartPageComponent(){
    return(
        <div className="cartPage-background">
            <div className='cartPage-container'>
                <div className='left-section'>
                    <div className='text-container'>
                        <p className='cart'>Korpa</p>
                        <p className='price'>Ukupno: <span className='price-highlight'>1800.00</span> rsd</p>
                    </div>
                    <div className='items-container'>
                        <CartCard/>
                        <CartCard/>
                        <CartCard/>
                        <CartCard/>
                    </div>
                </div>
                <div className='right-section'>
                    <div className='info'>
                        <div className='costs'>
                            <p>Ukupno: <span className='price-highlight'>1800.00</span> rsd</p>
                            <p>Placanje pouzećem: <span className='price-highlight'>300.00</span> rsd</p> 
                        </div>
                        <div className='summary'>
                            <p className='total'>Ukupno za naplatu: <span className='price-highlight'>2100.00</span> rsd</p>
                            <Button route="/home" text='Nastavi'/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}