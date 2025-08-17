document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.querySelector(".chat-body");
    const messageInput = document.querySelector(".message-input");
    const sendMessageButton = document.querySelector("#send-message");
        // Removed emojiPickerButton and attachFileInput
    const typingIndicator = document.getElementById("typing-indicator");

    const API_KEY = ""; // Replace with your key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const createMessageElement = (content, ...classes) => {
        const div = document.createElement("div");
        div.classList.add("message", ...classes);
        div.innerHTML = content;
        return div;
    };

    const generateBotResponse = async (incomingMessageDiv, userMessage) => {
        const messageElement = incomingMessageDiv.querySelector(".message-text");
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error?.message || "Unknown API error");

            const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from bot.";
            

            // Convert **bold** markdown to <b>bold</b> HTML and support line breaks
            let formattedResponse = apiResponseText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            formattedResponse = formattedResponse.replace(/\n/g, '<br>');

            messageElement.innerHTML = formattedResponse;

        } catch (error) {
            console.error("Bot error:", error);
            alert("Bot failed to respond: " + error.message);
            messageElement.innerText = "⚠️ Error: Bot could not respond.";
        } finally {
            incomingMessageDiv.classList.remove("thinking");
            chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
        }
    };


    const handleOutgoingMessage = () => {
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        messageInput.value = "";
        typingIndicator.style.display = "none";

        const outgoingMessageDiv = createMessageElement(
            `<div class="message-text">${userMessage}</div>`,
            "user-message"
        );
        chatBody.appendChild(outgoingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

        const incomingMessageDiv = createMessageElement(
            `<div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>`,
            "bot-message",
            "thinking"
        );
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

        generateBotResponse(incomingMessageDiv, userMessage);
    };

    // Emoji picker (basic browser emoji)
        // Emoji picker logic removed

    // Typing indicator
    messageInput.addEventListener("input", () => {
        if (messageInput.value.trim()) {
            typingIndicator.style.display = "block";
        } else {
            typingIndicator.style.display = "none";
        }
    });

    // Attach file
        // Attach file logic removed

    sendMessageButton.addEventListener("click", handleOutgoingMessage);

    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleOutgoingMessage();
        }
    });
});
