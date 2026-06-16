const model = require('../models/fila.models');

exports.abrirSolicitacao = async (req, res, next) => {
    try {
        const { id_maquina, id_solicitante, id_tecnico, descricao_problema } = req.body;

        if (!id_maquina || !id_solicitante || !descricao_problema) {
            return res.status(400).json({ sucess: false, message: "Campos obrigatórios faltando." });
        }

        const novoId = await model.abrirSolicitacao({
            id_maquina,
            id_solicitante,
            id_tecnico,
            descricao_problema
        });

        res.json({ sucess: true, id: novoId });
    } catch (err) {
        next(err);
    }
};

exports.listarProximas = async (req, res, next) => {
    try {
        const dados = await model.listarProximasManutencoes();
        res.json(dados);
    } catch (err) {
        next(err);
    }
};
exports.buscarConcluidas = async (req, res) => {
    try {
        const dados = await model.listarConcluidas();
        res.json({ sucess: true, dados: dados });
    } catch (err) {
        res.status(500).json({ sucess: false, message: "Erro ao buscar histórico." });
    }
};

exports.listarAtivas = async (req, res, next) => {
    try {
        const dados = await model.listarAtivas();
        res.json({ sucess: true, dados });
    } catch (err) { next(err); }
};

exports.getHistorico = async (req, res, next) => {
    try {
        const dados = await model.historicoPorMaquina(req.params.id_maquina);
        res.json({ sucess: true, dados });
    } catch (err) { next(err); }
};

exports.iniciar = async (req, res, next) => {
    try {
        const { id_fila, id_tecnico } = req.body;
        await model.iniciar(id_fila, id_tecnico);
        res.json({ sucess: true, message: 'Manutenção iniciada!' });
    } catch (err) { 
        next(err); 
    }
};

exports.concluir = async (req, res, next) => {
    try {
        const { id_fila, manutencoes_realizadas, dias, tipo } = req.body;
        await model.finalizarManutencao(id_fila, manutencoes_realizadas, dias, tipo);
        
        res.json({ sucess: true, message: 'Manutenção finalizada com sucesso!' });
    } catch (err) { 
        next(err); 
    }
};

exports.assumirChamado = async (req, res, next) => {
    try {
        const { id_fila, id_tecnico } = req.body;

        console.log("Recebido para assumir:", id_fila, id_tecnico); // LOG DE DEBUG

        const sucesso = await model.vincularTecnico(id_fila, id_tecnico);

        if (sucesso) {
            res.json({ sucess: true });
        } else {
            // Se cair aqui, o ID enviado não existe na tabela fila
            res.json({ sucess: false, message: "ID da fila não encontrado no banco." });
        }
    } catch (err) { next(err); }
};

exports.cancelar = async (req, res, next) => {
    try {
        const { id_fila } = req.body; // Recebe o ID do corpo da requisição
        
        if (!id_fila) {
            return res.status(400).json({ sucess: false, message: "ID da fila é obrigatório." });
        }

        await model.cancelarSolicitacao(id_fila);
        res.json({ sucess: true, message: 'Solicitação cancelada com sucesso!' });
    } catch (err) { 
        next(err); 
    }
};