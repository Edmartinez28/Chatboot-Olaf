document.addEventListener("DOMContentLoaded", function() {
    appendMessage("Hola bienvenido a tu Chatboot de consulta, me llamo Olaf, en que te puedo ayudar hoy ?", "Olaf") 
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
            appendMessage("Respuesta obtenidad de: "+response.referencia, "Olaf");
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
        imageDiv.innerHTML = `<img src="./static/fred.jpg" alt="Olaf">`;
        //imageDiv.innerHTML = `<img src="https://media.discordapp.net/attachments/1109874169723756595/1181384850733801502/fred.jpg?ex=6580dd61&is=656e6861&hm=648c64f09bb5f4fdeaac606219310d2a234c92d43ae9b6888103f8d6391de9d6&=&format=webp&width=548&height=548" alt="Olaf">`;
        containerDiv.appendChild(imageDiv);
    }

    // Agregar el contenedor de mensaje al contenedor
    containerDiv.appendChild(messageContainerDiv);

    // Agregar el contenedor al cuadro de chat
    chatBox.appendChild(containerDiv);

    // Desplazar automáticamente hacia abajo para mostrar el mensaje más reciente.
    chatBox.scrollTop = chatBox.scrollHeight;
}

function startSpeechRecognition() {
    var recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'es-ES'; // Establece el idioma de reconocimiento
    recognition.interimResults = true; // Activa los resultados parciales

    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
    };

    recognition.onend = function() {
        recognition.stop();
    };

    recognition.start();
}

