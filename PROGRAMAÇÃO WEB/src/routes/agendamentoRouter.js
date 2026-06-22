const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const autenticacaoAdmin = require('../middlewares/autenticacaoAdmin');


router.get('/agendamento', agendamentoController.getIndex);
router.post('/agendamento', agendamentoController.postAgendamento);
router.get('/meus_agendamentos', agendamentoController.getMeusAgendamentos);
router.get('/agendamento/editar/:id', agendamentoController.getEditar);
router.post('/agendamento/editar/:id', agendamentoController.postEditar);
router.post('/agendamento/excluir/:id', agendamentoController.postExcluir);


router.get('/admin/horarios', autenticacaoAdmin, agendamentoController.listarAdmin);
router.post('/admin/horarios/confirmar/:id', autenticacaoAdmin, agendamentoController.confirmar);
router.post('/admin/horarios/cancelar/:id', autenticacaoAdmin, agendamentoController.cancelar);


router.get("/detalhar/:id", autenticacaoAdmin, agendamentoController.getDetalharAgendamento);

module.exports = router;