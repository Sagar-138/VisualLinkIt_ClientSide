document.querySelector('.chat-button').addEventListener('click', function() {
    document.querySelector('.chat-button').style.display = "none";
    document.querySelector('.chat-box').style.visibility = "visible";
});

document.querySelector('.chat-box .chat-box-header p').addEventListener('click', function() {
    document.querySelector('.chat-button').style.display = "block";
    document.querySelector('.chat-box').style.visibility = "hidden";
});

document.getElementById("addExtra").addEventListener("click", function() {
    document.querySelector(".modal").classList.toggle("show-modal");
});

document.querySelector(".modal-close-button").addEventListener("click", function() {
    document.querySelector(".modal").classList.toggle("show-modal");
});

// Function to format time in 12-hour clock with AM/PM
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
}

// Function to add messages to chat box
function addMessageToChatBox(message, isSend = true) {
    const chatBoxBody = document.querySelector('.chat-box-body');
    const messageElement = document.createElement('div');
    messageElement.classList.add(isSend ? 'chat-box-body-send' : 'chat-box-body-receive');
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageElement.appendChild(messageText);
    
    const messageTime = document.createElement('span');
    messageTime.textContent = formatTime(new Date());
    messageElement.appendChild(messageTime);
    
    chatBoxBody.appendChild(messageElement);
    chatBoxBody.scrollTop = chatBoxBody.scrollHeight; // Scroll to bottom
}

// Event listener for send button
document.querySelector('.send').addEventListener('click', async function() {
    const inputElement = document.querySelector('input[type="text"]');
    const query = inputElement.value.trim();

    if (!query) return;

    // Add user's message to chat box
    addMessageToChatBox(query, true);

    // Call API
    try {
        const response = await fetch(`http://localhost:3001/api/questions/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok) {
            addMessageToChatBox(data.answer, false);
        } else {
            addMessageToChatBox('Sorry, I could not find an answer to your question.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessageToChatBox('Error connecting to the server. Please try again later.', false);
    }

    // Clear input field
    inputElement.value = '';
});

// Optionally add enter key functionality for sending messages
document.querySelector('input[type="text"]').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.querySelector('.send').click();
    }
});
