import { BOARD_SIZE, BOARD_COLS, BOARD_ROWS, MILESTONE_CELLS, CHARACTERS, getCellPosition } from '../config/characters.js';
import PlayerToken from './PlayerToken.jsx';

const ROW_COLORS = [
  '#ffe0ec', '#ffd6f0', '#f0d6ff', '#d6e0ff',
  '#d6f0ff', '#d6ffe8', '#e8ffd6', '#fffbd6',
  '#ffe8d6', '#ffd6d6', '#ffe0ec', '#ffd6f0',
  '#f0d6ff', '#d6e0ff', '#d6f0ff', '#d6ffe8',
  '#e8ffd6', '#fffbd6', '#ffe8d6', '#ffd6d6',
];

const MILESTONE_EMOJIS = ['⭐', '🌟', '💫', '✨', '🌈', '🎀', '🎵', '💖', '🦋', '🍀',
  '⭐', '🌟', '💫', '✨', '🌈', '🎀', '🎵', '💖', '🦋', '🏆'];

export default function SnakeBoard({ users }) {
  const tokensByCell = {};
  const userMap = {}; // slug → total_points

  users.forEach((user) => {
    userMap[user.slug] = user.total_points;
    const pos = Math.min(user.total_points, BOARD_SIZE - 1);
    if (!tokensByCell[pos]) tokensByCell[pos] = [];
    tokensByCell[pos].push(user.slug);
  });

  const cells = Array.from({ length: BOARD_SIZE }, (_, i) => {
    const { row, col } = getCellPosition(i);
    const rowFromBottom = BOARD_ROWS - 1 - row;
    const isMilestone = MILESTONE_CELLS.includes(i);
    const milestoneIdx = MILESTONE_CELLS.indexOf(i);
    const isStart = i === 0;
    const isFinish = i === BOARD_SIZE - 1;
    const tokens = tokensByCell[i] || [];
    const reachedUsers = users.filter(u => Math.min(u.total_points, BOARD_SIZE - 1) >= i);
    const cellColor = ROW_COLORS[rowFromBottom % ROW_COLORS.length];

    return (
      <div
        key={i}
        className={[
          'sticker-cell',
          isMilestone ? 'sticker-cell--milestone' : '',
          isStart ? 'sticker-cell--start' : '',
          isFinish ? 'sticker-cell--finish' : '',
          tokens.length > 0 ? 'sticker-cell--active' : '',
          reachedUsers.length > 0 && tokens.length === 0 ? 'sticker-cell--reached' : '',
        ].join(' ')}
        style={{ gridRow: row + 1, gridColumn: col + 1, '--cell-color': cellColor }}
      >
        {reachedUsers.length > 0 && tokens.length === 0 && (
          <div className="sticker-cell__fill">
            {reachedUsers.map((u) => (
              <span key={u.slug} className="sticker-dot" style={{ background: CHARACTERS[u.slug].tokenColor }} />
            ))}
          </div>
        )}

        <span className="sticker-cell__num">{i + 1}</span>

        {isMilestone && tokens.length === 0 && reachedUsers.length === 0 && (
          <span className="sticker-cell__milestone-emoji">{MILESTONE_EMOJIS[milestoneIdx]}</span>
        )}

        {isStart && <span className="sticker-cell__label">GO!</span>}
        {isFinish && <span className="sticker-cell__label">🏆</span>}

        {tokens.length > 0 && (
          <div className="sticker-cell__tokens">
            {tokens.map((slug, idx) => (
              <PlayerToken
                key={slug}
                slug={slug}
                totalPoints={userMap[slug] ?? 0}
                offset={tokens.length > 1 ? (idx === 0 ? -7 : 7) : 0}
              />
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="hachupyoung-board">
      <div className="hachupyoung-board__header">
        <span className="hachupyoung-board__title">🌸 달란트판 🌸</span>
        {/* <span className="hachupyoung-board__subtitle">달란트 200개를 향해 출발!</span> */}
      </div>
      <div
        className="sticker-grid"
        style={{
          gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </div>
  );
}
