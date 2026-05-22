
const usuarioModel = require('../models/auth.models'); // Ajuste o caminho se necessário

exports.auth = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Chama a função buscar do Model
        const user = await usuarioModel.buscar(email);

        // Verifica se o usuário existe
        if (!user) {
            return res.status(401).json({ sucess: false, message: "Usuário não encontrado." });
        }

        // Verifica a senha
        if (user.senha === password) {
            
            // LOG DE DEBUG PARA VOCÊ VER NO TERMINAL
            console.log("Login realizado por:", user.nome_usuario, "ID:", user.id_usuario);

            // RETORNA OS DADOS PARA O FRONT-END
            return res.json({
                sucess: true,
                id_usuario: user.id_usuario,
                nome_usuario: user.nome_usuario,
                tipo: user.tipo
            });
        } else {
            return res.status(401).json({ sucess: false, message: "Senha incorreta." });
        }

    } catch (err) {
        console.error("Erro na autenticação:", err);
        res.status(500).json({ sucess: false, message: "Erro interno no servidor." });
    }
};