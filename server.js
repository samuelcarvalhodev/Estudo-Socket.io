const express = require('express');
const path = require('path');
const cors = require('cors')



const app = express();

const server = require('http').createServer(app); //protocolo http
//aplicado configurações de cors devido  bloqueio
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
}); //protocolo wss

app.use(express.static(path.join(__dirname, 'public')));

//definindo onde vão ficar as views
app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use('/', (req, res) => {
    res.render('index.html');
})

let messages = [];
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    
    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data =>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
})


server.listen(3000,() => console.log(`Server iniciado em "localhost:3000"`));
