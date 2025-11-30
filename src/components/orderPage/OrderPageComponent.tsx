import OrderCard from '../orderCard/OrderCard';
import './orderPageComponent.scss';

export default function OrderPageComponent(){
    return(
        <div className="orderPage-background">
            <div className='card-container'>
                <OrderCard/>
                <OrderCard/>
                <OrderCard/>
                <OrderCard/>
                <OrderCard/>
                <OrderCard/>
            </div>
        </div>
    )
}
