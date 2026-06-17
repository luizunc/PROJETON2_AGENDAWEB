const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const autenticacaoAdmin = require('../middlewares/autenticacaoAdmin');

router.get('/admin/dashboard', autenticacaoAdmin, dashboardController.index);

module.exports = router;
