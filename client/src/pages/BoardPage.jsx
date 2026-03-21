import { useNavigate } from 'react-router-dom';
import SnakeBoard from '../components/SnakeBoard.jsx';
import LevelBadge from '../components/LevelBadge.jsx';
import { useUsers } from '../hooks/useUsers.js';

export default function BoardPage() {
  const navigate = useNavigate();
  const { users, loading, error, refetch } = useUsers(30000);

  const sophieUser = users.find(u => u.slug === 'sophie');
  const cinnaUser = users.find(u => u.slug === 'cinnamoroll');

  return (
    <div className="page board-page">
      <header className="page-header">
        <h1 className="page-title">🌟 달란트 보드 🌟</h1>
        <div className="page-header__actions">
          <button className="btn-nav" onClick={refetch} title="새로고침">🔄</button>
          <button className="btn-nav" onClick={() => navigate('/scan')}>달란트 추가 →</button>
        </div>
      </header>

      <main className="board-page__main">
        {loading && (
          <div className="board-page__loading">
            <div className="loading-spinner">✨</div>
            <p>불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="board-page__error">
            <p>서버에 연결할 수 없어요 😢</p>
            <button className="btn btn--primary" onClick={refetch}>다시 시도</button>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="board-page__layout">


            {/* 스티커판 */}
            <div className="board-page__board-container">
              <SnakeBoard users={users} />
              <div className="board-page__footer">
                <button className="btn btn--primary btn--large" onClick={() => navigate('/scan')}>
                  ✨ 달란트 추가하기
                </button>
              </div>
            </div>

            {/* 시나모롤 패널 */}
            {cinnaUser && (
              <div className="board-page__side board-page__side--cinna">
                <div className="char-bg char-bg--cinna" />
                <LevelBadge slug={cinnaUser.slug} totalPoints={cinnaUser.total_points} large />
              </div>
            )}
            {/* 소피루비 패널 */}
            {sophieUser && (
              <div className="board-page__side board-page__side--sophie">
                <div className="char-bg char-bg--sophie" />
                <LevelBadge slug={sophieUser.slug} totalPoints={sophieUser.total_points} large />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
