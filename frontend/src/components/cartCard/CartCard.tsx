import './cartCard.scss';
import Image from 'next/image';
import { CartItem } from '../../lib/cart';
import Button from '../button/Button';

type Props = {
  item: CartItem;
  onRemove: (bookId: number) => void;
  onUpdate: (bookId: number, qty: number) => void;
};

export default function CartCard({ item, onRemove, onUpdate }: Props){
    return(
        <div className="card-container">
            <div className='card-image'>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title}/>}
            </div>

            <div className='cart-content'>
                <p className='book-title'>{item.title}</p>
                <p className='book-price'>Cena: <span className='price-highlight'>{item.price.toFixed(2)}</span> rsd</p>
                <div className='quantity'>
                    <div className='minus' onClick={()=> onUpdate(item.bookId, Math.max(1, item.quantity - 1))}>-</div>
                    <div className='number'>{item.quantity}</div>
                    <div className='plus' onClick={()=> onUpdate(item.bookId, item.quantity + 1)}>+</div>
                </div>
                <div className='cart-card-actions'>
                    <Button text='Ukloni' onClick={() => onRemove(item.bookId)}/>
                </div>
            </div>

        </div>
    )
}