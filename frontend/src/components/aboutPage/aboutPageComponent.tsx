'use client'
import './aboutPageComponent.scss';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

export default function AboutPageComponent() {
    const [images, setImages] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // FETCH PODATAKA SA BACKENDA
    useEffect(() => {
        fetch('/api/images')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch images');
                return res.json();
            })
            .then(data => {
                // data je niz objekata: [{id: 1, imageUrl: "..."}, ...]
                // Mapiramo ga tako da dobijemo samo niz stringova
                const imagePaths = data.map((img: any) => img.imageUrl);
                setImages(imagePaths);
                setLoading(false);
            })
            .catch(err => {
                console.error("Greška pri učitavanju slika:", err);
                setLoading(false);
            });
    }, []);

    const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));

    // Swipe logika
    const touchStartX = useRef<number | null>(null);
    const touchDeltaX = useRef<number>(0);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const onTouchEnd = () => {
        const threshold = 50;
        if (touchDeltaX.current > threshold) prev();
        else if (touchDeltaX.current < -threshold) next();
        touchStartX.current = null;
    };

    // Prikaz dok se slike učitavaju
    if (loading) return (
        <div className="about-loading">
            <div className="loading-spinner"></div>
            <p>Učitavanje...</p>
        </div>
    );
    // Prikaz ako nema slika
    if (images.length === 0) return (
        <div className="about-error">
            <p>Galerija je trenutno prazna.</p>
        </div>
    );

    const tekst1 = `Stefan Vlku rođen je 18. januara 2002. godine u rudarskom gradu Majdanpeku, ispod planine Starica, koji leži na zlatonosnoj reci Pek. Osnovnu i srednju školu završava u rodnom gradu, a potom upisuje Akademiju tehničkih strukovnih studija u Požarevcu, da bi, nakon završetka osnovnih studija, upisao i Master studije u istom gradu. Pre pisanja, jako dugo se bavio boksom, a takmičio se čak i u Rimu.`;
    
    const tekst2 = `Disciplina, koju je stekao za vreme bavljenja ovom plemenitom veštinom, pomogla mu je u svakoj sferi njegovog interesovanja. Tako u avgustu 2024. godine, on objavljuje svoj prvi roman pod nazivom "Bogatir" koji je lepo dočekan i prihvaćen. Početkom 2025. godine, on već objavljuje svoj drugi roman pod nazivom "Projekat 3" koji je propraćen velikim interesovanjem, baš kao i prvi. Stefan trenutno živi i radi u Požarevcu, sa svojom životnom saputnicom Janom.`;

    return (
        <>
            <div className='about-background'>
                <div className='about-content-wrapper'>
                    <div className='about-header'>
                        <h1 className='about-title'>O Autoru</h1>
                        <div className='title-underline'></div>
                    </div>
                    
                    <div className='about-main-content'>
                        <div className='about-text-section'>
                            <div className='text-card'>
                                <p>{tekst1}</p>
                            </div>
                            <div className='text-card'>
                                <p>{tekst2}</p>
                            </div>
                        </div>
                        
                        <div className='about-gallery-section'>
                            <div className='gallery-wrapper'>
                                <button className='gallery-arrow gallery-arrow-left' onClick={prev} aria-label="Previous image">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>

                                <div className='gallery-image-container'>
                                    <img 
                                        src={images[index]} 
                                        alt={`Stefan Vlku - Fotografija ${index + 1}`}
                                        className='gallery-image'
                                    />
                                    <div className='image-counter'>{index + 1} / {images.length}</div>
                                </div>

                                <button className='gallery-arrow gallery-arrow-right' onClick={next} aria-label="Next image">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='about-phone-container'>
                <div className='empty-space'></div>
                <div className='text-container'>
                    <p>{tekst1}</p>
                </div>

                <div className='gallery-phone'>
                    <div
                        className='touch-gallery'
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <Image 
                            src={images[index]} 
                            alt={`Gallery ${index + 1}`} 
                            width={300} 
                            height={300} 
                            priority 
                            className="touch-image" 
                        />
                    </div>
                </div>

                <div className='text-container'>
                    <p>{tekst2}</p>
                </div>
            </div>
        </>
    );
}