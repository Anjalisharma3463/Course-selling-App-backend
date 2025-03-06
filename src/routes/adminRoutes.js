const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');

router.post('/signup', (req, res) => { /* Admin Signup Logic */ });
router.post('/login', (req, res) => { /* Admin Login Logic */ });
router.post('/courses', verifyAdmin, (req, res) => { /* Create Course */ });

module.exports = router;
