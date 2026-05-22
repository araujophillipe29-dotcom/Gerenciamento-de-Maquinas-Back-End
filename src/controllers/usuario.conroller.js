const model = require('../models/usuario.models');

exports.listarUsuarios = async (req, res, next) => {
    try{
        const usuarios = await model.buscarTodosUsuarios();
        res.json(usuarios);
    }catch(err){
        next(err);
    }
};

exports.buscarIdUsuario = async (req, res, next) => {
    try {
        const usuario = await model.buscarIdUsuario(req.params.id);
        if (!usuario) return res.status(404).json({erro: 'Usuario não encontrada'});
        res.json(usuario);
    } catch(err){
        next(err)
    }
};

exports.criarUsuario = async (req, res, next) => {
    try {
        const { nome_usuario, email, senha, tipo } = req.body;
        console.log('req.body:', req.body);
        const id_usuario = await model.criarUsuario({ nome_usuario, email, senha, tipo });
        return res.status(201).json({ id_usuario, nome_usuario, email, tipo });
    } catch (err) {
        next(err); 
    }
};

exports.atualizarUsuario = async (req, res, next) => {
    try {
        const { nome_usuario, email, tipo, senha } = req.body;
        await model.atualizarUsuario(req.params.id, { nome_usuario, email, tipo, senha });
        res.json({ mensagem : 'Usuario atualizado'});
        console.log('Usuário atualizado') 
    } catch (err) {
        next(err);
    }
};

exports.deletarUsuario = async (req, res, next) => {
    try{
        await model.deletarUsuario(req.params.id);
        res.json({mensagem : 'Usuário removida'});
    } catch (err){
        next(err);
    }
}

exports.listarTecnicos = async (req, res, next) => {
    try {
        // Busca no banco onde tipo = 'tecnico'
        const tecnicos = await model.buscarPorTipo('tecnico');
        res.json(tecnicos);
    } catch (err) {
        next(err);
    }
};

exports.listarSolicitantes = async (req, res, next) => {
    try {
        // Busca no banco onde tipo = 'solicitante'
        const solicitantes = await model.buscarPorTipo('solicitante');
        res.json(solicitantes);
    } catch (err) {
        next(err);
    }
};