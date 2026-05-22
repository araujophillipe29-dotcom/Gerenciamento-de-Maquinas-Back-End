const express = require('express');
const controller = require('../controllers/usuario.conroller');

const router = express.Router()

router.get('/tecnicos', controller.listarTecnicos);
router.get('/solicitantes', controller.listarSolicitantes);
router.get('/', controller.listarUsuarios);
router.get('/:id', controller.buscarIdUsuario);
router.post('/', controller.criarUsuario);
router.put('/:id', controller.atualizarUsuario);
router.delete('/:id', controller.deletarUsuario);


module.exports = router;