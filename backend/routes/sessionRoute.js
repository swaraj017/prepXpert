const express = require('express');
const {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} = require('../controller/sessioncontroller');

const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');  

const router = express.Router();

router.post('/create', ClerkExpressRequireAuth(), createSession);
router.get('/my-sessions', ClerkExpressRequireAuth(), getMySessions);
router.get('/:id', ClerkExpressRequireAuth(), getSessionById);
router.delete('/:id', ClerkExpressRequireAuth(), deleteSession);

module.exports = router;
