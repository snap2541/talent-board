import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { CHARACTERS, getLevel } from '../config/characters.js';

export default function AdminPage() {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = Object.keys(CHARACTERS);
    Promise.all(slugs.map((slug) => api.getQr(slug)))
      .then((results) => {
        const map = {};
        results.forEach((r) => { map[r.slug] = r; });
        setQrData(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page admin-page">
      <header className="page-header no-print">
        <button className="btn-nav" onClick={() => navigate('/board')}>← 보드</button>
        <h1 className="page-title">QR 코드 관리</h1>
        <button className="btn-nav" onClick={() => window.print()}>🖨️ 인쇄</button>
      </header>

      <main className="admin-page__main">
        <p className="admin-page__desc no-print">아래 QR 코드를 인쇄해서 각자 보관하세요!</p>

        {loading && <div className="admin-page__loading">불러오는 중... ✨</div>}

        <div className="admin-page__cards">
          {Object.entries(CHARACTERS).map(([slug, char]) => {
            const qrEntry = qrData[slug];
            const level = getLevel(slug, 0);
            return (
              <div key={slug} className={`qr-card theme-${char.theme}`}>
                <div className="qr-card__name">{char.displayNameKo}</div>
                <div className="qr-card__token-wrap">
                  <img
                    className="qr-card__token-img"
                    src={level.image}
                    alt={char.displayNameKo}
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                </div>
                {qrEntry ? (
                  <div
                    className="qr-card__svg"
                    dangerouslySetInnerHTML={{ __html: qrEntry.svg }}
                  />
                ) : (
                  <div className="qr-card__loading">생성 중...</div>
                )}
                <div className="qr-card__hint">이 QR로 달란트를 추가해요!</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
