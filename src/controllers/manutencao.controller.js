const model = require('../models/manutencao.models');

exports.listarMaquina = async (req, res, next) => {
    try{
        const maquinas = await model.buscarTodasMaquinas();
        res.json(maquinas);
    }catch{
        next(err)
    }
};

exports.buscarIdMaquina = async (req, res, next) => {
    try {
        const maquina = await model.buscarID(req.params.id);
        if (!maquina) return res.status(404).json({erro: 'Maquina não encontrada'});
        res.json(maquina);
    } catch(err){
        next(err)
    }
};

exports.criarMaquina = async (req, res, next) => {
    try {
        const { nome_maquina, descricao, situacao } = req.body;
        console.log(req.bory, 'req.bory');
        const id_maquina = await model.criarMaquina({nome_maquina, descricao, situacao});
        res.status(201).json({id_maquina, nome_maquina, descricao, situacao});
    } catch(err) {
        next(err);
    }
};

exports.atualizarMaquina = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { nome_maquina, descricao, situacao } = req.body;
        await model.atualizarMaquina(req.params.id, { nome_maquina, descricao, situacao });
        res.json({ mensagem : 'Maquina atualizado'});
        console.log('Maquina atualizado') 
    } catch (err) {
        next(err);
    }
};

exports.deletarMaquina = async (req, res, next) => {
    try{
        await model.deletarMaquinas(req.params.id);
        res.json({mensagem : 'Maquina removida'});
    } catch (err){
        next(err);
    }
}

