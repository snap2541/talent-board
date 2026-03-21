const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/scan — qr_token으로 사용자 조회
router.post('/', (req, res) => {
  const { qr_token } = req.body;
  if (!qr_token) return res.status(400).json({ error: 'qr_token이 필요합니다' });

  const user = db.prepare('SELECT id, name, name_ko, slug, theme, total_points FROM user_totals WHERE qr_token = ?').get(qr_token);
  if (!user) return res.status(404).json({ error: '알 수 없는 QR 코드입니다' });

  res.json({ user });
});

module.exports = router;
