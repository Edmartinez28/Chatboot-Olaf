/*document.addEventListener("DOMContentLoaded", function() {
    appendMessage("Hola bienvenido a Chatbanker, en que te puedo ayudar el día de hoy", "Olaf") 
});

function sendMessage() {
    var userInput = document.getElementById("user-input").value;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/generar_respuesta/" + encodeURIComponent(userInput) + "/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status == 200) {
            // Manejar la respuesta del servidor (puede ser un mensaje del chatbot).
            var response = JSON.parse(xhr.responseText);
            appendMessage(response.mensaje, "Olaf");  // Cambiado a response.mensaje según tu vista Django
        } else {
            console.error("Error en la solicitud al servidor");
        }
    };

    xhr.send();

    // Agregar el mensaje del usuario al chat.
    appendMessage(userInput, "You");

    // Limpiar el campo de entrada después de enviar el mensaje.
    document.getElementById("user-input").value = "";
}
/*
function sendMessage() {
    var userInput = document.getElementById("user-input").value;

    console.log(userInput);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/chat/send_message/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status == 200) {
            // Manejar la respuesta del servidor (puede ser un mensaje del chatbot).
            var response = JSON.parse(xhr.responseText);
            appendMessage(response.message, "bot");
        } else {
            console.error("Error en la solicitud al servidor");
        }
    };

    xhr.send(JSON.stringify({ message: userInput }));

    // Agregar el mensaje del usuario al chat.
    appendMessage(userInput, "user");

    // Limpiar el campo de entrada después de enviar el mensaje.
    document.getElementById("user-input").value = "";
}


function appendMessage(message, sender) {
    var chatBox = document.getElementById("chat-box");
    var messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.innerHTML = "<strong>" + sender + ":</strong> " + message;
    chatBox.appendChild(messageDiv);

    // Desplazar automáticamente hacia abajo para mostrar el mensaje más reciente.
    chatBox.scrollTop = chatBox.scrollHeight;
}*/

document.addEventListener("DOMContentLoaded", function() {
    appendMessage("Hola bienvenido a Chatbanker, me llamo Olaf, en que te puedo ayudar el día de hoy", "Olaf") 
});

function sendMessage() {
    var userInput = document.getElementById("user-input").value;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/generar_respuesta/" + encodeURIComponent(userInput) + "/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status == 200) {
            // Manejar la respuesta del servidor (puede ser un mensaje del chatbot).
            var response = JSON.parse(xhr.responseText);
            appendMessage(response.mensaje, "Olaf");  // Cambiado a response.mensaje según tu vista Django
        } else {
            console.error("Error en la solicitud al servidor");
        }
    };

    xhr.send();

    // Agregar el mensaje del usuario al chat.
    appendMessage(userInput, "You");

    // Limpiar el campo de entrada después de enviar el mensaje.
    document.getElementById("user-input").value = "";
}
/*
function sendMessage() {
    var userInput = document.getElementById("user-input").value;

    console.log(userInput);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/chat/send_message/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status == 200) {
            // Manejar la respuesta del servidor (puede ser un mensaje del chatbot).
            var response = JSON.parse(xhr.responseText);
            appendMessage(response.message, "bot");
        } else {
            console.error("Error en la solicitud al servidor");
        }
    };

    xhr.send(JSON.stringify({ message: userInput }));

    // Agregar el mensaje del usuario al chat.
    appendMessage(userInput, "user");

    // Limpiar el campo de entrada después de enviar el mensaje.
    document.getElementById("user-input").value = "";
}*/


function appendMessage(message, sender) {
    var chatBox = document.getElementById("chat-box");

    // Crear un contenedor para el mensaje dentro del contenedor de color
    var messageContainerDiv = document.createElement("div");
    messageContainerDiv.classList.add("message-container", sender === "Olaf" ? "olaf-message" : "user-message");

    // Crear un elemento para el texto del mensaje
    var messageDiv = document.createElement("div");
    messageDiv.className = "message-text";
    messageDiv.textContent = message;

    // Agregar el mensaje al contenedor de mensaje
    messageContainerDiv.appendChild(messageDiv);

    // Crear un contenedor para contener la imagen y el contenedor de mensaje
    var containerDiv = document.createElement("div");
    containerDiv.classList.add("message-container-wrapper", sender === "Olaf" ? "olaf-wrapper" : "user-wrapper");

    // Si el remitente es "Olaf", agregar la imagen circular
    if (sender === "Olaf") {
        var imageDiv = document.createElement("div");
        imageDiv.className = "message-image";
        imageDiv.innerHTML = `<img src="https://lumiere-a.akamaihd.net/v1/images/ct_frozen_olaf_18466_eabe1344.jpeg?region=0,0,600,600" alt="Olaf">`;
        containerDiv.appendChild(imageDiv);
    }

    // Agregar el contenedor de mensaje al contenedor
    containerDiv.appendChild(messageContainerDiv);

    // Agregar el contenedor al cuadro de chat
    chatBox.appendChild(containerDiv);

    // Desplazar automáticamente hacia abajo para mostrar el mensaje más reciente.
    chatBox.scrollTop = chatBox.scrollHeight;
}

