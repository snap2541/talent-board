import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrScanner({ onSuccess, onError }) {
  const scannerRef = useRef(null);
  const startedRef = useRef(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    // 이전 마운트가 남긴 내용 초기화 (React StrictMode 이중 마운트 방지)
    const el = document.getElementById('qr-reader');
    if (el) el.innerHTML = '';

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => { onSuccess(decodedText); },
        () => { }
      )
      .then(() => { startedRef.current = true; })
      .catch((err) => {
        setCameraError('카메라를 사용할 수 없습니다. 권한을 확인해 주세요.');
        if (onError) onError(err);
      });

    return () => {
      if (scannerRef.current && startedRef.current) {
        startedRef.current = false;
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => { });
      }
    };
  }, []);

  return (
    <div className="qr-scanner-wrapper">
      <div id="qr-reader" className="qr-reader" />
      {cameraError && (
        <div className="qr-scanner__error">
          <p>{cameraError}</p>
        </div>
      )}
      {!cameraError && (
        <p className="qr-scanner__hint">📷 QR 코드를 카메라에 비춰주세요</p>
      )}
    </div>
  );
}
