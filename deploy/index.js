const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
app.get('/server', function (req, res) {
    res.json({message: 'Segundo server (3001): Buildando react https://142.93.15.138:3000/'});
    });

app.listen(process.env.PORT || 3001);

console.log('Servidor deploy do React ouvindo na porta 3001');