const db = require('../config/db');

exports.buscarTodasMaquinas = async () => {
    const [rows] = await db.promise().query('SELECT * FROM maquinas');
    return rows;
};

exports.buscarID = async (id) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM maquinas WHERE id_maquina = ?', [id]
    );
    return rows[0];
};

exports.criarMaquina = async ({ nome_maquina, descricao, situacao}) => {
    const [result] = await db.promise().query(
        'INSERT INTO maquinas (nome_maquina, descricao, situacao) VALUES (?, ?, ?)',
        [nome_maquina, descricao, situacao]
    );
    return result.insertId;
};

exports.atualizarMaquina = async (id_maquina, { nome_maquina, descricao, situacao }) => {
    await db.promise().query(
        'UPDATE maquinas SET nome_maquina = ?, descricao = ?, situacao = ? WHERE id_maquina = ?',
        [nome_maquina, descricao, situacao, id_maquina]
    );
};

exports.deletarMaquinas = async (id) => {
    await db.promise().query(
        'DELETE FROM maquinas WHERE id_maquina = ?', [id]
    );
};
