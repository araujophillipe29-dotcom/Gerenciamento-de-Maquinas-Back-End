const db = require('../config/db');

exports.buscarTodosUsuarios = async () => {
    const [rows] = await db.promise().query('SELECT * FROM manutencao_maquinas.usuario');
    return rows;
};

exports.buscarIdUsuario = async (id_usuario) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM manutencao_maquinas.usuario WHERE id_usuario = ?', [id_usuario]
    );
    return rows[0];
};

exports.criarUsuario = async ({ nome_usuario, email, senha, tipo}) => {
    const [result] = await db.promise().query(
        'INSERT INTO manutencao_maquinas.usuario (nome_usuario, email, senha, tipo) VALUES (?, ?, ?, ?)',
        [nome_usuario, email, senha, tipo]
    );
    return result.insertId;
};

exports.atualizarUsuario = async (id_usuario, { nome_usuario, email, tipo, senha }) => {
    await db.promise().query(
        'UPDATE manutencao_maquinas.usuario SET nome_usuario = ?, email = ?, tipo = ?, senha = ? WHERE id_usuario = ?',
        [nome_usuario, email, tipo, senha, id_usuario]
    );
};

exports.deletarUsuario = async (id) => {
    await db.promise().query(
        'DELETE FROM manutencao_maquinas.usuario WHERE id_usuario = ?', [id]
    );
};

exports.buscarPorTipo = async (tipo) => {
    const [rows] = await db.promise().query(
        'SELECT id_usuario, nome_usuario FROM usuario WHERE tipo = ?',
        [tipo]
    );
    return rows;
};