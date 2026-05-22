const db = require('../config/db');

exports.buscar = async (email) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM manutencao_maquinas.usuario WHERE email = ?', [email]
    );
    return rows[0];
};