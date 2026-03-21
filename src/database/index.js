const mongoose = require('mongoose');
require('dotenv').config();

// Peguei a sua URI e adicionei o nome do banco 'noderest' antes do '?'
const uri = process.env.MONGO_URL;

mongoose.connect(uri)
  .then(() => {
    console.log("Conectado ao MongoDB Atlas com sucesso!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB Atlas:", err);
  });

// O Mongoose já lida com Promises nativas, então não precisa de mais nada aqui.
module.exports = mongoose;