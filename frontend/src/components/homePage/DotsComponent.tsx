'use client';

import './dotsComponent.scss';

export default function DotsComponent() {
  // Tačne koordinate tačkica iz originalnog SVG-a sa pravilnim redosledom
  const dots = [
    { text: 'ŽIVOT', dotX: 175.127, dotY: 12.6632, textX: 125, textY: 15, align: 'end' },
    { text: 'JE', dotX: 341.641, dotY: 69.9183, textX: 370, textY: 72, align: 'start' },
    { text: 'IGRA', dotX: 89.3379, dotY: 92.0327, textX: 40, textY: 95, align: 'end' },
    { text: 'TAČKICA', dotX: 249.02, dotY: 165.041, textX: 280, textY: 168, align: 'start' },
    { text: 'SAMO', dotX: 125.071, dotY: 225.022, textX: 75, textY: 228, align: 'end' },
    { text: 'IH', dotX: 297.714, dotY: 255.619, textX: 330, textY: 258, align: 'start' },
    { text: 'TREBA', dotX: 67.1829, dotY: 302.877, textX: 25, textY: 305, align: 'end' },
    { text: 'PAMETNO', dotX: 228.248, dotY: 390.123, textX: 265, textY: 393, align: 'start' },
    { text: 'SPOJITI', dotX: 85.9112, dotY: 444.955, textX: 40, textY: 448, align: 'end' }
  ];

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

        {/* Connecting lines - direkto iz originalnog SVG-a */}
        <g className="dots-lines">
          <path d="M239.486 168.07L134.775 222.255" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="166.011" y2="-0.5" transform="matrix(0.940922 0.338623 -0.413932 0.910308 175.11 12.4165)" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="241.673" y2="-0.5" transform="matrix(-0.997754 0.0669913 -0.084531 -0.996421 341.424 75.827)" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="175.342" y2="-0.5" transform="matrix(0.909152 0.416465 -0.500933 0.865486 80.0735 92.0171)" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="155.535" y2="-0.5" transform="matrix(0.985202 0.171398 -0.21469 0.976682 134.606 228.052)" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="215.658" y2="-0.5" transform="matrix(-0.982125 0.188231 -0.235358 -0.971909 288.52 258.951)" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="163.869" y2="-0.5" transform="matrix(0.876913 0.480649 -0.569344 0.8221 75.3555 308.027)" stroke="white" strokeWidth="1"/>
          <line y1="-0.5" x2="133.732" y2="-0.5" transform="matrix(-0.942126 0.335259 -0.410079 -0.91205 220.416 395.273)" stroke="white" strokeWidth="1"/>
        </g>

        {/* Dots and labels */}
        {dots.map((dot, index) => (
          <g key={index} className="dot-group" data-index={index}>
            {/* Red dot */}
            <ellipse 
              cx={dot.dotX} 
              cy={dot.dotY} 
              rx="10" 
              ry="9" 
              className="red-dot"
            />
            
            {/* Label */}
            <text
              x={dot.textX}
              y={dot.textY}
              textAnchor={dot.align}
              dominantBaseline="middle"
              className="dot-label"
            >
              {dot.text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
