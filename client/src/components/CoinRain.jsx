import { useEffect, useRef } from 'react';

export default function CoinRain({ active }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    for (let i = 0; i < 30; i++) {
      const coin = document.createElement('img');
      coin.src = '/images/mario-coins.gif';
      coin.className = 'coin-rain__coin';
      const left = Math.random() * 100;
      const delay = Math.random() * 0.4;
      const duration = 0.5 + Math.random() * 0.4;
      const size = 44 + Math.random() * 28;

      coin.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: -${size + 10}px;
        animation: coinFall ${duration}s ease-in ${delay}s forwards;
        image-rendering: pixelated;
      `;
      container.appendChild(coin);
    }

    const timer = setTimeout(() => { container.innerHTML = ''; }, 2200);
    return () => clearTimeout(timer);
  }, [active]);

  return <div ref={containerRef} className="coin-rain-container" />;
}
