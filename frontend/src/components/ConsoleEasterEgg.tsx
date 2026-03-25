'use client';

import { useEffect } from 'react';

export default function ConsoleEasterEgg() {
  useEffect(() => {
    const styles = [
      'color: #ff6b6b',
      'font-size: 16px',
      'font-weight: bold',
      'text-shadow: 2px 2px 0px rgba(0,0,0,0.2)'
    ].join(';');

    const linkStyles = [
      'color: #4ecdc4',
      'font-size: 14px',
      'font-weight: bold'
    ].join(';');

    console.log('%c🚀 Sajt napravio: Nikola Kostić', styles);
    console.log('%c🔗 GitHub: https://github.com/kole284', linkStyles);
    console.log('%c💻 Ako tražiš developera, javi se! 😉', 'color: #95e1d3; font-size: 12px;');
  }, []);

  return null;
}
