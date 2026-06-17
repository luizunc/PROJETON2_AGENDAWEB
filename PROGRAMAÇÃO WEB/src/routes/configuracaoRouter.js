const express = require('express');
const router = express.Router();
const configuracaoController = require('../controllers/configuracaoController');
const autenticacaoAdmin = require('../middlewares/autenticacaoAdmin');

router.get('/admin/configuracoes', autenticacaoAdmin, configuracaoController.listar);
router.post('/admin/configuracoes', autenticacaoAdmin, configuracaoController.salvar);

module.exports = router;
