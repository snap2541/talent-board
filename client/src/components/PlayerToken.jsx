import { CHARACTERS, getLevel } from '../config/characters.js';

export default function PlayerToken({ slug, totalPoints = 0, offset = 0 }) {
  const char = CHARACTERS[slug];
  const level = getLevel(slug, totalPoints);

  return (
    <div
      className="player-token"
      style={{ background: char.tokenColor, transform: `translateX(${offset}px)` }}
      title={`${char.displayNameKo} - ${level.label}`}
    >
      <img
        className="player-token__img"
        src={level.image}
        alt={char.displayNameKo}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <span className="player-token__emoji-fallback" style={{ display: 'none' }}>
        {char.tokenEmoji}
      </span>
    </div>
  );
}
