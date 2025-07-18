const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    input.value = "";

    setTimeout(() => {
        appendMessage("bot", "Gemini is Thinking...(this is dummy response)");
    }, 500);

    // Send user message to the backend and get AI response
    fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.generatedText) {
                appendMessage("bot", data.generatedText);
            } else if (data.error) {
                appendMessage("bot", `Error: ${data.error}`);
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            appendMessage(
                "bot",
                `Sorry, something went wrong: ${error.message}`
            );
        });
});

function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
