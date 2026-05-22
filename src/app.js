const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

const filaRoutes = require('./routes/fila.routes')
const manutencaoRoutes = require('./routes/manutencao.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/erro.middlewares');

app.use('/fila', filaRoutes);
app.use('/man', manutencaoRoutes);
app.use('/usu', usuariosRoutes);
app.use('/auth', authRoutes);
app.use(errorMiddleware);

module.exports = app;
