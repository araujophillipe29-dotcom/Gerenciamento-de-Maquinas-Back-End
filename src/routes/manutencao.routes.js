const express = require('express');
const controller = require('../controllers/manutencao.controller');

const router = express.Router()

router.get('/', controller.listarMaquina);
router.get('/:id', controller.buscarIdMaquina);
router.post('/', controller.criarMaquina);
router.put('/:id', controller.atualizarMaquina);
router.delete('/:id', controller.deletarMaquina);


module.exports = router;