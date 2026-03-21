import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from '../components/QrScanner.jsx';
import PointInput from '../components/PointInput.jsx';
import Confetti from '../components/Confetti.jsx';
import CoinRain from '../components/CoinRain.jsx';
import Toast from '../components/Toast.jsx';
import { api } from '../api/client.js';
import { didLevelUp } from '../config/characters.js';
import { useSound } from '../hooks/useSound.js';

export default function ScanPage() {
  const navigate = useNavigate();
  const { playSound, playSoundNTimes } = useSound();

  const [phase, setPhase] = useState('scanning');
  const [user, setUser] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [coinRain, setCoinRain] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const handleScanSuccess = useCallback(async (token) => {
    if (phase !== 'scanning') return;
    try {
      playSound('scan.mp3');
      const { user: resolvedUser } = await api.scan(token);
      setUser(resolvedUser);
      setQrToken(token);
      setPhase('scanned');
    } catch (e) {
      setToast({ message: e.message, type: 'error' });
    }
  }, [phase, playSound]);

  const handleSubmit = useCallback(async (delta, note) => {
    if (!qrToken || loading) return;
    setLoading(true);
    try {
      const result = await api.addPoints(qrToken, delta, note);
      const leveledUp = didLevelUp(user.slug, result.old_total, result.new_total);

      if (leveledUp) {
        playSound('levelup.mp3');
        setToast({ message: `🎉 레벨 업! 달란트 ${result.new_total}개 달성!`, type: 'success' });
      } else {
        playSoundNTimes('coin.mp3', delta, 100);
        setToast({ message: `✨ +${delta} 달란트 추가! (총 ${result.new_total}개)`, type: 'success' });
      }

      setConfetti(true);
      setCoinRain(true);
      setPhase('done');

      setTimeout(() => {
        setConfetti(false);
        setCoinRain(false);
        navigate('/board');
      }, 2200);
    } catch (e) {
      setToast({ message: e.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [qrToken, user, loading, navigate, playSound, playSoundNTimes]);

  const handleCancel = () => {
    setUser(null);
    setQrToken(null);
    setPhase('scanning');
  };

  const themeClass = user ? `theme-${user.theme}` : '';

  return (
    <div className={`page scan-page ${themeClass}`}>
      <Confetti active={confetti} />
      <CoinRain active={coinRain} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

      <header className="page-header">
        <button className="btn-nav" onClick={() => navigate('/board')}>← 보드</button>
        <h1 className="page-title">달란트 추가 ✨</h1>
        <button className="btn-nav" onClick={() => navigate('/admin')}>QR 보기</button>
      </header>

      <main className="scan-page__main">
        {phase === 'scanning' && (
          <div className="scan-page__scanner-area">
            <div className="scan-page__intro">
              <div className="scan-page__star-row">⭐ ⭐ ⭐</div>
              <p className="scan-page__prompt">QR 코드를 스캔해서<br />누군지 알려줘요!</p>
            </div>
            <QrScanner onSuccess={handleScanSuccess} />
          </div>
        )}

        {(phase === 'scanned' || phase === 'submitting') && user && (
          <PointInput
            user={user}
            qr_token={qrToken}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        )}

        {phase === 'done' && (
          <div className="scan-page__done">
            <div className="scan-page__done-emoji">🎉</div>
            <p>달란트가 추가됐어요!</p>
            <p className="scan-page__done-sub">보드로 이동 중...</p>
          </div>
        )}
      </main>
    </div>
  );
}
