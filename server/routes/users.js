const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users — 전체 사용자 + 누적 포인트
router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, name, name_ko, slug, theme, total_points FROM user_totals').all();
  res.json(users);
});

// GET /api/users/:slug — 단일 사용자 + 최근 로그 20개
router.get('/:slug', (req, res) => {
  const user = db.prepare('SELECT id, name, name_ko, slug, theme, total_points FROM user_totals WHERE slug = ?').get(req.params.slug);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });

  const log = db.prepare(
    'SELECT id, delta, note, created_at FROM points_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(user.id);

  res.json({ ...user, log });
});

module.exports = router;
