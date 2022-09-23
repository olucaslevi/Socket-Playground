const express = require('express');
const socket = require("socket.io");
const app = express();
const connection = require('./Database/database');
const cors = require('cors');

// socket.io issues

const PORT = 5000;
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });


const io = socket(server);

io.on("connection", (socket) => { 
    /* BLOCO DE CODIGOS  */
    console.log("Socket.io connected", socket.id);
}); 


const userController = require('./Components/users/userController');

// Database
/// db authentication
connection
    .authenticate()
    .then(()=>{
        console.log('Comunicando com o banco de dados com sucesso !')
}).catch((err)=>{
    console.log("Erro encontrado: ", err);
})

///
app.use(cors());
app.use(express.json()); // * Para que o express entenda o formato json
///


// conjuntos de rotas
app.use("/", userController);

// Rota principal
app.get('/',(req,res)=>{
    res.send('Hello World !');
})
// Rota de teste
app.post('/teste',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    console.log(req.body);

})


