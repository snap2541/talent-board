export const BOARD_SIZE = 200;
export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;
export const MILESTONE_CELLS = Array.from({ length: 20 }, (_, i) => (i + 1) * 10 - 1); // 9,19,...,199

export const CHARACTERS = {
  sophie: {
    displayName: 'Sophie Ruby',
    displayNameKo: '소피루비',
    theme: 'pink',
    levels: [
      { minPoints: 0,   image: '/images/sophie/sophie_lv1.png', label: '공주 새싹',     emoji: '🌱' },
      { minPoints: 30,  image: '/images/sophie/sophie_lv2.png', label: '핑크 기사',     emoji: '⚔️' },
      { minPoints: 60,  image: '/images/sophie/sophie_lv3.png', label: '마법 소녀',     emoji: '✨' },
      { minPoints: 90,  image: '/images/sophie/sophie_lv4.png', label: '루비 공주',     emoji: '💎' },
      { minPoints: 120, image: '/images/sophie/sophie_lv5.png', label: '루비 여왕',     emoji: '👑' },
      { minPoints: 150, image: '/images/sophie/sophie_lv6.png', label: '소피 레전드',   emoji: '🌟' },
      { minPoints: 180, image: '/images/sophie/sophie_lv7.png', label: '전설의 소피',   emoji: '🏆' },
      { minPoints: 200, image: '/images/sophie/sophie_lv8.png', label: '달란트 마스터', emoji: '💫' },
    ],
    tokenColor: '#ff8fab',
    tokenEmoji: '👸',
  },
  cinnamoroll: {
    displayName: 'Cinnamoroll',
    displayNameKo: '시나모롤',
    theme: 'blue',
    levels: [
      { minPoints: 0,   image: '/images/cinnamoroll/cinna_lv1.png', label: '폭신 구름',     emoji: '☁️' },
      { minPoints: 30,  image: '/images/cinnamoroll/cinna_lv2.png', label: '달콤 빵집',     emoji: '🍞' },
      { minPoints: 60,  image: '/images/cinnamoroll/cinna_lv3.png', label: '하늘 탐험가',   emoji: '🌈' },
      { minPoints: 90,  image: '/images/cinnamoroll/cinna_lv4.png', label: '시나모 스타',   emoji: '⭐' },
      { minPoints: 120, image: '/images/cinnamoroll/cinna_lv5.png', label: '달빛 요정',     emoji: '🌙' },
      { minPoints: 150, image: '/images/cinnamoroll/cinna_lv6.png', label: '구름 왕자',     emoji: '👼' },
      { minPoints: 180, image: '/images/cinnamoroll/cinna_lv7.png', label: '시나모 레전드', emoji: '🌟' },
      { minPoints: 200, image: '/images/cinnamoroll/cinna_lv8.png', label: '달란트 마스터', emoji: '💫' },
    ],
    tokenColor: '#90e0ef',
    tokenEmoji: '🐰',
  },
};

export function getLevel(slug, totalPoints) {
  const levels = CHARACTERS[slug].levels;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].minPoints) return { ...levels[i], index: i };
  }
  return { ...levels[0], index: 0 };
}

export function didLevelUp(slug, oldPoints, newPoints) {
  return getLevel(slug, oldPoints).index !== getLevel(slug, newPoints).index;
}

// 칸 인덱스 → {row, col} (CSS Grid 좌표) — 뱀 경로 (아래→위)
export function getCellPosition(index, cols = BOARD_COLS, rows = BOARD_ROWS) {
  const rowFromBottom = Math.floor(index / cols);
  const col = (rowFromBottom % 2 === 0)
    ? index % cols
    : cols - 1 - (index % cols);
  const row = rows - 1 - rowFromBottom;
  return { row, col };
}
