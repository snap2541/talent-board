const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/points — 포인트 추가
router.post('/', (req, res) => {
  const { qr_token, delta, note } = req.body;

  if (!qr_token) return res.status(400).json({ error: 'qr_token이 필요합니다' });
  if (!delta || typeof delta !== 'number' || delta <= 0 || !Number.isInteger(delta)) {
    return res.status(400).json({ error: 'delta는 양의 정수여야 합니다' });
  }

  const user = db.prepare('SELECT id, name, name_ko, slug, theme, total_points FROM user_totals WHERE qr_token = ?').get(qr_token);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });

  const old_total = user.total_points;

  db.prepare('INSERT INTO points_log (user_id, delta, note) VALUES (?, ?, ?)').run(user.id, delta, note || null);

  const updated = db.prepare('SELECT total_points FROM user_totals WHERE id = ?').get(user.id);
  const new_total = updated.total_points;

  res.json({
    user: { id: user.id, name: user.name, name_ko: user.name_ko, slug: user.slug, theme: user.theme },
    old_total,
    new_total,
  });
});

// GET /api/points/:userId — 포인트 로그
router.get('/:userId', (req, res) => {
  const log = db.prepare(
    'SELECT id, delta, note, created_at FROM points_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).all(req.params.userId);
  res.json(log);
});

module.exports = router;
