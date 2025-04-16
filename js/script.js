import { Storage } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const messagesEl = document.getElementById("messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const clearBtn = document.getElementById("clear-chat");
  const themeBtn = document.getElementById("toggle-theme");
  const changeNameBtn = document.getElementById("change-name");

  // Apply saved theme
  if (Storage.getTheme() === "dark") {
    document.body.classList.add("dark");
  }

  // Set theme button label
  themeBtn.textContent = document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";

  // Get or prompt for username
  let username = Storage.getUsername() || prompt("Enter your name:");
  Storage.saveUsername(username);

  // Load and show previous messages
  const messages = Storage.getMessages();
  messages.forEach(msg => appendMessage(msg));

  // On message submit
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const msg = {
      user: username,
      text,
      time: new Date().toLocaleTimeString()
    };

    messages.push(msg);
    Storage.saveMessages(messages);
    appendMessage(msg);
    input.value = "";

    // Show typing indicator
    const typing = document.createElement("div");
    typing.classList.add("typing-indicator");
    typing.textContent = "...";
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Simulate Echo Bot reply
    setTimeout(() => {
      typing.remove();
      const reply = getBotReply(text);
      const botMsg = {
        user: "Echo Bot",
        text: reply,
        time: new Date().toLocaleTimeString()
      };
      messages.push(botMsg);
      Storage.saveMessages(messages);
      appendMessage(botMsg);
    }, 800);
  });

  // Clear chat button
  clearBtn.addEventListener("click", () => {
    if (confirm("Clear all chat messages?")) {
      Storage.clearMessages();
      messagesEl.innerHTML = "";
    }
  });

  // Theme toggle button
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "dark" : "light";
    Storage.saveTheme(mode);
    themeBtn.textContent = mode === "dark" ? "☀️ Light" : "🌙 Dark";
  });

  // Change name button
  changeNameBtn.addEventListener("click", () => {
    const newName = prompt("Enter your new name:");
    if (newName) {
      username = newName;
      Storage.saveUsername(newName);
    }
  });

  // Append message to the chat window
  function appendMessage({ user, text, time }) {
    const div = document.createElement("div");
    div.classList.add("message");
  
    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = user === "Echo Bot" ? "assets/echo-avatar.png" : "assets/user-avatar.png";
  
    const content = document.createElement("div");
    content.classList.add("message-content");
    content.innerHTML = `<span>${user}</span>: ${text} <small>${time}</small>`;
  
    div.appendChild(avatar);
    div.appendChild(content);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }  

  // Echo Bot logic with in-memory facts
  let echoMemory = Storage.getMemory();

  echoMemory[category] = value;
  Storage.saveMemory(echoMemory);

  function getBotReply(input) {
    if (input.startsWith("/help")) {
      return `Available commands:
      /help – show this menu
      /clear – clear all messages
      /name [new name] – change your name
      /joke – tell a joke
      `;
    }
    
    if (input.startsWith("/clear")) {
      messages.length = 0;
      Storage.clearMessages();
      messagesEl.innerHTML = "";
      return "All messages cleared!";
    }
    
    if (input.startsWith("/name ")) {
      const newName = input.slice(6).trim();
      if (newName) {
        username = newName;
        Storage.saveUsername(newName);
        return `Alright, I’ll call you ${newName} from now on.`;
      } else {
        return "Please provide a name after /name.";
      }
    }   

    const msg = input.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) return "Hey there! 😊";
    if (msg.includes("how are you")) return "I'm just code... but thanks for asking!";
    if (msg.includes("joke")) return "Why don't programmers like nature? Too many bugs.";
    if (msg.includes("bye")) return "See ya later! 👋";

    const teachMatch = msg.match(/my favorite (\w+) is (.+)/);
    if (teachMatch) {
      const [_, category, value] = teachMatch;
      echoMemory[category] = value;
      return `Got it. I'll remember your favorite ${category} is ${value}.`;
    }

    const askMatch = msg.match(/what'?s my favorite (\w+)/);
    if (askMatch) {
      const category = askMatch[1];
      return echoMemory[category]
        ? `You told me your favorite ${category} is ${echoMemory[category]}.`
        : `I don’t know your favorite ${category} yet.`;
    }

    return "I'm not sure how to respond to that yet.";
  }
});