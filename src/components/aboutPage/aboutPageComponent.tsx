import './aboutPageComponent.scss';
import Image from 'next/image';
export default function AboutPageComponent() {
    return (
        <>
        <div className='about-background'>
            <div className='about-left-side'>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                </p>
            </div>
            <div className='about-right-side'>
                <div className='gallery-container'>
                    <div className='button-left'>
                        <Image
                            src="/images/arrow-left.svg"
                            alt="Leva strelica"
                            width={50}
                            height={50}
                            priority
                        />
                    </div>
                    <div className='image-gallery'></div>
                    <div className='button-right'>
                         <Image
                            src="/images/arrow-right.svg"
                            alt="Leva strelica"
                            width={50}
                            height={50}
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div className='about-phone-container'>
            <div className='empty-space'></div>
            <div className='text-container'>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                </p>
            </div>

            <div className='gallery-phone'>

            </div>

            <div className='text-container'>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi ex, rem vero enim quod saepe quaerat sit nisi amet id odit veniam mollitia provident! Labore quos odit dolor id doloremque!
                </p>
            </div>
            
        </div>
        </>
    );
}