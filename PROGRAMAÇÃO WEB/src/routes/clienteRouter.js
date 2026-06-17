const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticacaoAdmin = require('../middlewares/autenticacaoAdmin');

router.get('/admin/clientes', autenticacaoAdmin, clienteController.listar);
router.post('/admin/clientes/criar', autenticacaoAdmin, clienteController.criar);
router.post('/admin/clientes/editar/:id', autenticacaoAdmin, clienteController.editar);
router.post('/admin/clientes/deletar/:id', autenticacaoAdmin, clienteController.deletar);

module.exports = router;
