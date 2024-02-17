// Define the OpenAI API key
// require('dotenv').config(); // تهيئة مكتبة dotenv
// // استدعاء قيمة apiKey من متغيرات البيئة
// const apiKey = process.env.OPENAI_API_KEY; // Replace 'YOUR_OPENAI_API_KEY' with your actual API key


const apiKey = 'YOR_OPENAI_API_KEY'; // Replace 'YOUR_OPENAI_API_KEY' with your actual API key

// Define the variables for bot and user names and images
const BOT_NAME = "Safwan - ChatGPT BOT";
const PERSON_NAME = "you";
const BOT_IMG = "images/ChatGPT.png";
const PERSON_IMG = "images/p.jpg";

// Function to send messages
async function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var messageText = messageInput.value.trim();

    if (messageText !== '') {
        var chatMessages = document.getElementById('chat-messages');
        var userMessage = document.createElement('div');
        userMessage.className = 'msg right-msg'; // Use the 'right-msg' class for user messages
        userMessage.innerHTML = `
            <div class="msg-img" style="background-image: url(${PERSON_IMG})"></div>
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${PERSON_NAME}</div>
                    <div class="msg-info-time">${formatDate(new Date())}</div>
                </div>
                <div class="msg-text">${messageText}</div>
            </div>`;
        chatMessages.appendChild(userMessage);

        // Clear the input field
        messageInput.value = '';

        // Scroll to the bottom of the chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send user message to OpenAI GPT API
        const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: messageText,
                max_tokens: 150,
                temperature: 0.9, // تحكم في درجة الالتزام بالنص الأصلي مقابل الإبداع العشوائي
                top_p: 1 // تحديد النسبة المئوية من الردود المقترحة التي يجب أن يتوقف توليد النص فيها
            })
        });


        if (response.ok) {
            const data = await response.json();
            const chatReply = data.choices[0].text.trim();

            // Display AI's reply
            var aiMessage = document.createElement('div');
            aiMessage.className = 'msg left-msg'; // Use the 'left-msg' class for bot messages
            aiMessage.innerHTML = `
                <div class="msg-img" style="background-image: url(${BOT_IMG})"></div>
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">${BOT_NAME}</div>
                        <div class="msg-info-time">${formatDate(new Date())}</div>
                    </div>
                    <div class="msg-text">${chatReply}</div>
                </div>`;
            chatMessages.appendChild(aiMessage);

            // Scroll to the bottom of the chat messages after AI's reply
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            console.error('Failed to fetch data from the OpenAI API.');
        }
    }
}

// Function to format the time
function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}


