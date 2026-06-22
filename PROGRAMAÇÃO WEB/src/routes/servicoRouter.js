const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const autenticacaoAdmin = require('../middlewares/autenticacaoAdmin');

router.get('/admin/servicos', autenticacaoAdmin, servicoController.listar);
router.post('/admin/servicos/criar', autenticacaoAdmin, servicoController.criar);
router.post('/admin/servicos/editar/:id', autenticacaoAdmin, servicoController.editar);
router.post('/admin/servicos/deletar/:id', autenticacaoAdmin, servicoController.deletar);
router.post('/admin/servicos/ativar/:id', autenticacaoAdmin, servicoController.ativar);

module.exports = router;
