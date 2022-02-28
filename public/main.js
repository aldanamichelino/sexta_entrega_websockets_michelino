const socket = io('http://localhost:8080');

const productsInfo = document.getElementById('productsInfo');
const addProductForm = document.getElementById('addProductForm');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const imageUrlInput = document.getElementById('imageUrl');

const sendMessage = document.getElementById('sendMessage');
const userMessage = document.getElementById('userMessage');
const userEmail = document.getElementById('userEmail');
const sendMessageButton = document.getElementById('send-message-button');



socket.on('products', (products) => {

    fetch('http://localhost:8080/list.hbs')
        .then(data => data.text())
        .then(data => {
            const template = Handlebars.compile(data);
            const embeddedTemplate = template({ products: products, list: products.length > 0})

            productsInfo.innerHTML = embeddedTemplate;
        });
});

userEmail.addEventListener('input', (e) => {
    if(userEmail.value.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
        sendMessageButton.removeAttribute("disabled");
    }else{
        sendMessageButton.setAttribute("disabled", "");
    }
})

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        name: nameInput.value,
        price: priceInput.value,
        imageUrl: imageUrlInput.value

    };

    socket.emit('new-product', newProduct);
    nameInput.value = '';
    priceInput.value = '';
    imageUrlInput.value = '';
});

const renderMessage = (newMessage) => {
    const div = document.createElement('div');
    if(newMessage){
        html=`<div class="my-messages">
                <span style="color: brown;"><span class="font-weight-bold text-primary">${newMessage.email}</span> [${newMessage.time}]: <span class="font-italic text-success">${newMessage.message}</span></span><br/>
            </div>`;
    };

    div.innerHTML = html;
    document.getElementById('chat-list').appendChild(div);
};

socket.on('messages', (messages) => {
    messages.map(message => {
        renderMessage(message);
    })
})


sendMessage.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if(userMessage.value){
        const newMessage = {
            email: userEmail.value,
            time: moment().format('DD/MM/YYYY  HH:mm:ss'),
            message: userMessage.value
        };

        socket.emit('new-message', newMessage);
        userMessage.value = '';
    } else {
        alert('Debes escribir un mensaje');
    }

});

socket.on('messages-to-everyone', (newMessage) => {
    renderMessage(newMessage);
});