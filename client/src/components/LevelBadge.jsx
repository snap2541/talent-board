import { CHARACTERS, getLevel } from '../config/characters.js';
import { useState, useEffect } from 'react';

export default function LevelBadge({ slug, totalPoints, large = false }) {
  const char = CHARACTERS[slug];
  const level = getLevel(slug, totalPoints);
  const [animating, setAnimating] = useState(false);
  const [prevLevelIdx, setPrevLevelIdx] = useState(level.index);

  useEffect(() => {
    if (level.index !== prevLevelIdx) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 800);
      setPrevLevelIdx(level.index);
    }
  }, [level.index, prevLevelIdx]);

  const nextLevel = char.levels[level.index + 1];
  const progressInLevel = nextLevel
    ? totalPoints - level.minPoints
    : char.levels[char.levels.length - 1].minPoints;
  const progressMax = nextLevel ? nextLevel.minPoints - level.minPoints : 10;

  return (
    <div className={[
      'level-badge',
      `theme-${char.theme}`,
      animating ? 'level-badge--levelup' : '',
      large ? 'level-badge--large' : '',
    ].join(' ')}>
      <div className="level-badge__avatar">
        <img
          src={level.image}
          alt={char.displayNameKo}
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div className="level-badge__avatar-fallback" style={{ display: 'none', background: char.tokenColor }}>
          {char.tokenEmoji}
        </div>
      </div>
      <div className="level-badge__info">
        <div className="level-badge__name">{char.displayNameKo}</div>
        <div className="level-badge__level">
          <span className="level-badge__emoji">{level.emoji}</span>
          {level.label}
        </div>
        <div className="level-badge__points">
          <span className="level-badge__points-num">{totalPoints}</span> 달란트
        </div>
        {nextLevel && (
          <>
            <div className="level-badge__progress-bar">
              <div
                className="level-badge__progress-fill"
                style={{ width: `${Math.min((progressInLevel / progressMax) * 100, 100)}%` }}
              />
            </div>
            <div className="level-badge__next-hint">
              다음 레벨까지 {nextLevel.minPoints - totalPoints}개
            </div>
          </>
        )}
        {!nextLevel && (
          <div className="level-badge__max">👑 최고 레벨!</div>
        )}
      </div>
    </div>
  );
}
