import { useState } from 'react';
import { CHARACTERS, getLevel } from '../config/characters.js';

const QUICK_AMOUNTS = [1, 3, 5, 10];

export default function PointInput({ user, qr_token, onSubmit, onCancel, loading }) {
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState('');
  const [note, setNote] = useState('');

  const char = CHARACTERS[user.slug];
  const level = getLevel(user.slug, user.total_points);

  const delta = selected !== null ? selected : (parseInt(custom, 10) || 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (delta <= 0) return;
    onSubmit(delta, note.trim() || undefined);
  }

  return (
    <div className={`point-input theme-${char.theme}`}>
      <div className="point-input__header">
        <div className="point-input__avatar" style={{ background: char.tokenColor }}>
          <img
            src={level.image}
            alt={char.displayNameKo}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{ fontSize: '2.5rem' }}>{char.tokenEmoji}</span>
        </div>
        <div>
          <div className="point-input__name">{char.displayNameKo}</div>
          <div className="point-input__current">현재 <strong>{user.total_points}</strong> 달란트</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <p className="point-input__label">달란트를 얼마나 추가할까요?</p>

        <div className="point-input__quick">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              className={`btn-quick ${selected === amt ? 'btn-quick--selected' : ''}`}
              onClick={() => { setSelected(amt); setCustom(''); }}
            >
              +{amt}
            </button>
          ))}
        </div>

        <div className="point-input__custom">
          <input
            type="number"
            min="1"
            max="99"
            value={custom}
            placeholder="직접 입력"
            onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
          />
        </div>

        <div className="point-input__note">
          <input
            type="text"
            value={note}
            placeholder="이유 (예: 성경암송, 심부름) — 선택"
            onChange={(e) => setNote(e.target.value)}
            maxLength={30}
          />
        </div>

        <div className="point-input__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="btn btn--primary" disabled={delta <= 0 || loading}>
            {loading ? '저장 중...' : `+${delta || '?'} 달란트 추가! ✨`}
          </button>
        </div>
      </form>
    </div>
  );
}
