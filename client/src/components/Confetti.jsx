import { useEffect, useRef } from 'react';

const COLORS = ['#ff8fab', '#ffd6e0', '#c77dff', '#90e0ef', '#ffdd00', '#b5e48c', '#ff6b6b', '#ffd93d'];

export default function Confetti({ active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 8 + Math.random() * 8;
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const duration = 1.8 + Math.random() * 1.2;
      const rotate = Math.random() * 720;
      const isCircle = Math.random() > 0.5;

      piece.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${isCircle ? size : size * 0.4}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        left: ${left}%;
        top: -20px;
        animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        transform: rotate(${rotate}deg);
      `;
      container.appendChild(piece);
    }

    const timer = setTimeout(() => { container.innerHTML = ''; }, 3500);
    return () => clearTimeout(timer);
  }, [active]);

  return <div ref={containerRef} className="confetti-container" />;
}
