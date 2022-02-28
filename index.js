const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

const products = [];
const messages = [];


//Middlewares
app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.static(path.resolve(__dirname, './views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Template engine
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'index.hbs'
}));

app.set('views', './views');
app.set('view engine', 'hbs');


//Port connection
httpServer.listen(PORT, () => {
    console.log(`Server is up & running on port ${PORT}`);
});

//Sockets events
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    //Products
    socket.emit('products', [...products]);

    socket.on('new-product', (newProduct) => {
        products.push(newProduct);
        io.emit('products', [...products]);
    });

    //Messages
    socket.emit('messages', [...messages]);

    socket.on('new-message', (newMessage) => {
        messages.push(newMessage);

        io.emit('messages-to-everyone', newMessage);
    })

});


//en el evento on click del front, hay que enviar un evento al servidor que agregue un producto 

//ademas hay que armar otro evento 
