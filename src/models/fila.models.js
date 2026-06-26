const db = require('../config/db');

exports.abrirSolicitacao = async (dados) => {

    const {
        id_maquina,
        id_solicitante,
        id_tecnico,
        descricao_problema
    } = dados;

    const statusInicial = 'em aberto';

    // Cria a nova solicitação
    const [result] = await db.promise().query(
        `
        INSERT INTO fila (
            id_maquina,
            id_solicitante,
            id_tecnico,
            descricao_problema,
            status,
            data_solicitacao
        ) 
        VALUES (?, ?, ?, ?, ?, NOW())
        `,
        [
            id_maquina,
            id_solicitante,
            id_tecnico,
            descricao_problema,
            statusInicial
        ]
    );

    // Tenta remover a manutenção pendente de forma segura
    try {
        await db.promise().query(
            `
            UPDATE fila
            SET 
                data_prevista_proxima = NULL,
                proxima_manutencao_tipo = NULL,
                proxima_manutencao_dias = NULL
            WHERE id_maquina = ?
            AND status = 'finalizado'
            `,
            [id_maquina]
        );
    } catch (updateError) {
        // Se falhar aqui, o erro é registrado no terminal, mas não quebra a requisição do usuário
        console.error("Aviso: Falha ao limpar prazos de manutenção anteriores:", updateError.message);
    }

    // Retorna o ID normalmente
    return result.insertId;
};

// Listar manutenções ativas
exports.listarAtivas = async () => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                f.*, 
                m.nome_maquina, 
                u_sol.nome_usuario AS nome_solicitante,
                u_tec.nome_usuario AS nome_tecnico
            FROM fila f
            INNER JOIN maquinas m ON f.id_maquina = m.id_maquina
            LEFT JOIN usuario u_sol ON f.id_solicitante = u_sol.id_usuario
            LEFT JOIN usuario u_tec ON f.id_tecnico = u_tec.id_usuario
            WHERE f.status NOT IN ('finalizado', 'cancelado')
            ORDER BY f.data_solicitacao DESC;
        `);
        return rows;
    } catch (error) {
        console.error("Erro no SQL:", error);
        throw error;
    }
};

exports.listarConcluidas = async () => {
    try {
        const [rows] = await db.promise().query(`
            SELECT 
                f.*, 
                m.nome_maquina, 
                u_sol.nome_usuario AS nome_solicitante
            FROM fila f
            JOIN maquinas m ON f.id_maquina = m.id_maquina
            LEFT JOIN usuario u_sol ON f.id_solicitante = u_sol.id_usuario
            WHERE f.status IN ('finalizado', 'cancelado')
            ORDER BY f.data_conclusao DESC
        `);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Histórico de uma máquina
exports.historicoPorMaquina = async (id_maquina) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM fila WHERE id_maquina = ? ORDER BY data_solicitacao DESC',
        [id_maquina]
    );
    return rows;
};

// Atualizar para "Em Manutenção"
exports.iniciar = async (id_fila, id_tecnico) => {
    await db.promise().query(
        'UPDATE fila SET status = "em manutenção", id_tecnico = ? WHERE id_fila = ?',
        [id_tecnico, id_fila]
    );
};

// Finalizar Manutenção
exports.finalizarManutencao = async (id_fila, relato, dias, tipo) => {
    // Forçar a conversão para garantir que números sejam números e não strings
    const idFilaNum = parseInt(id_fila, 10);
    const diasNum = parseInt(dias, 10);

    if (isNaN(idFilaNum) || isNaN(diasNum)) {
        throw new Error("ID da fila ou quantidade de dias inválidos.");
    }

    const query = `
        UPDATE fila
        SET 
            status = 'finalizado',
            data_conclusao = NOW(),
            relato_tecnico = ?,
            proxima_manutencao_dias = ?,
            proxima_manutencao_tipo = ?,
            data_prevista_proxima = DATE_ADD(CURDATE(), INTERVAL ? DAY)
        WHERE id_fila = ?`;

    await db.promise().query(query, [
        relato, 
        diasNum, 
        tipo, 
        diasNum, 
        idFilaNum
    ]);
};

exports.listarProximasManutencoes = async () => {
    const [rows] = await db.promise().query(`
        SELECT 
            f.id_fila, f.id_maquina, m.nome_maquina, f.proxima_manutencao_tipo,
            f.data_prevista_proxima,
            DATEDIFF(f.data_prevista_proxima, CURDATE()) AS dias_restantes
        FROM fila f
        JOIN maquinas m ON f.id_maquina = m.id_maquina
        WHERE f.status = 'finalizado'
        AND DATEDIFF(f.data_prevista_proxima, CURDATE()) >= 0 
        AND f.data_prevista_proxima IS NOT NULL
        ORDER BY f.data_prevista_proxima ASC
    `);
    return rows;
};

// Tecnico assumir serviço
exports.vincularTecnico = async (id_fila, id_tecnico) => {
    // Forçar conversão para número para evitar erros de comparação
    const [result] = await db.promise().query(
        "UPDATE fila SET id_tecnico = ?, status = 'em aberto' WHERE id_fila = ?",
        [Number(id_tecnico), Number(id_fila)]
    );

    console.log("Linhas afetadas:", result.affectedRows);
    return result.affectedRows > 0;
};

exports.cancelarSolicitacao = async (id_fila) => {
    await db.promise().query(
        'UPDATE fila SET status = "cancelado", data_conclusao = NOW() WHERE id_fila = ?',
        [id_fila]
    );
};