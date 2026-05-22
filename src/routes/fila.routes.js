const express = require('express');
const controller = require('../controllers/fila.controller');
const router = express.Router();

router.post('/abrir', controller.abrirSolicitacao);
router.get('/ativas', controller.listarAtivas);
router.get('/historico/:id_maquina', controller.getHistorico);
router.put('/iniciar', controller.iniciar);
router.put('/finalizar', controller.concluir);
router.put('/assumir', controller.assumirChamado);
router.get('/concluidas', controller.buscarConcluidas);
router.put('/cancelar', controller.cancelar);
router.get('/proximas', controller.listarProximas)

module.exports = router;