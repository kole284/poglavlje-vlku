import Button from "../button/Button";
import './homePageComponent.scss';
export default function HomePageComponent() {
  return (
    <>
      {/* 1. Desktop Layout */}
      <div className='homePage-background'>
        <div className='homePage-left-side'>
          <p className="homePage-title">
            poglavlje 
            <span className="homePage-title-highlight"> vlku</span>
          </p>
          <Button route="/about" text="Saznaj više"></Button>
        </div>
        
        <div className='homePage-right-side'>
          <div className="homePage-dots-svg"/>
        </div>
      </div>
      
      <div className='homePage-mobile'>
        <div className="homePage-mobile-top-half">
        <p className="homePage-title">
            "Bog nije u <span className="homePage-title-highlight">sili</span>
             , već u <span className="homePage-title-highlight">istini</span> i <span className="homePage-title-highlight">pravednosti</span>!"
            
          </p>
        </div>
        <div className="homePage-mobile-bottom-half">
           <p className="homePage-title">
            poglavlje<span className="homePage-title-highlight"> vlku</span>
          </p> 
          <Button text="Saznajte više" route="/about" />
        </div>
      </div>
    </>
  );
}