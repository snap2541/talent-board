const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const db = require('../db');

// GET /api/qr/:slug — QR SVG 반환
router.get('/:slug', async (req, res) => {
  const user = db.prepare('SELECT slug, qr_token FROM users WHERE slug = ?').get(req.params.slug);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });

  try {
    const svg = await QRCode.toString(user.qr_token, {
      type: 'svg',
      width: 200,
      margin: 2,
      color: { dark: '#333333', light: '#ffffff' },
    });
    res.json({ slug: user.slug, qr_token: user.qr_token, svg });
  } catch (err) {
    res.status(500).json({ error: 'QR 생성 실패' });
  }
});

module.exports = router;
