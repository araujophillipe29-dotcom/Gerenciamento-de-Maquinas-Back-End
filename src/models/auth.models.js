const db = require('../config/db');

exports.buscar = async (email) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM usuario WHERE email = ?', [email]
    );
    return rows[0];
};