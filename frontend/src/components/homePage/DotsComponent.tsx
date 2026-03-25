'use client';

import { useEffect, useState } from 'react';
import './dotsComponent.scss';

export default function DotsComponent() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkZoom = () => {
      const scale = window.visualViewport?.scale ?? 1;
      setIsVisible(scale * 100 <= 150);
    };
    checkZoom();
    window.addEventListener('resize', checkZoom);
    window.visualViewport?.addEventListener('resize', checkZoom);
    return () => {
      window.removeEventListener('resize', checkZoom);
      window.visualViewport?.removeEventListener('resize', checkZoom);
    };
  }, []);

  const dots: Array<{ text: string; dotX: number; dotY: number; textX: number; textY: number; align: 'start' | 'end' }> = [
    { text: 'ŽIVOT',    dotX: 175.127, dotY: 12.6632,  textX: 125, textY: 15,  align: 'end' },
    { text: 'JE',       dotX: 341.641, dotY: 69.9183,  textX: 370, textY: 72,  align: 'start' },
    { text: 'IGRA',     dotX: 89.3379, dotY: 92.0327,  textX: 40,  textY: 95,  align: 'end' },
    { text: 'TAČKICA',  dotX: 249.02,  dotY: 165.041,  textX: 280, textY: 168, align: 'start' },
    { text: 'SAMO',     dotX: 125.071, dotY: 225.022,  textX: 75,  textY: 228, align: 'end' },
    { text: 'IH',       dotX: 297.714, dotY: 255.619,  textX: 330, textY: 258, align: 'start' },
    { text: 'TREBA',    dotX: 67.1829, dotY: 302.877,  textX: 25,  textY: 305, align: 'end' },
    { text: 'PAMETNO',  dotX: 228.248, dotY: 390.123,  textX: 265, textY: 393, align: 'start' },
    { text: 'SPOJITI',  dotX: 85.9112, dotY: 444.955,  textX: 40,  textY: 448, align: 'end' },
  ];

  // Svaka linija spaja dots[i] → dots[i+1]
  // Delay: tačkica i se pojavljuje na i*0.3s
  //        linija i→i+1 kreće nakon što se tačkica i+1 pojavi = (i+1)*0.3s + 0.1s
  const DOT_INTERVAL = 0.3;   // razmak između pojave tačkica
  const DOT_DURATION = 0.4;   // trajanje fadeInDot animacije
  const LINE_DELAY_AFTER_DOT = 0.1; // čekanje nakon pojave druge tačke

  if (!isVisible) return null;

  return (
    <div className="dots-component">
      <svg viewBox="0 0 378 462" preserveAspectRatio="xMidYMid meet" fill="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connecting lines - apsolutne koordinate, od gornje ka donjoj tački */}
        <g className="dots-lines">
          {dots.slice(0, -1).map((dot, i) => {
            const next = dots[i + 1];
            // Linija krece kada se pojavi sledeca tackica
            const delay = (i + 1) * DOT_INTERVAL + DOT_DURATION + LINE_DELAY_AFTER_DOT;
            return (
              <line
                key={i}
                pathLength="1"
                x1={dot.dotX}
                y1={dot.dotY}
                x2={next.dotX}
                y2={next.dotY}
                stroke="white"
                strokeWidth="1"
                style={{ animationDelay: `${delay}s` }}
              />
            );
          })}
        </g>

        {/* Dots and labels */}
        {dots.map((dot, index) => {
          const dotDelay = index * DOT_INTERVAL;
          return (
            <g key={index} className="dot-group" data-index={index}>
              <ellipse
                cx={dot.dotX}
                cy={dot.dotY}
                rx="10"
                ry="9"
                className="red-dot"
                style={{ animationDelay: `${dotDelay}s` }}
              />
              <text
                x={dot.textX}
                y={dot.textY}
                textAnchor={dot.align}
                dominantBaseline="middle"
                className="dot-label"
                style={{ animationDelay: `${dotDelay + 0.1}s` }}
              >
                {dot.text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}