// storage.js — handles all localStorage interactions

export const Storage = {
  getMessages() {
    return JSON.parse(localStorage.getItem("chat-messages")) || [];
  },

  saveMessages(messages) {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  },

  clearMessages() {
    localStorage.removeItem("chat-messages");
  },

  getTheme() {
    return localStorage.getItem("chat-theme") || "light";
  },

  saveTheme(theme) {
    localStorage.setItem("chat-theme", theme);
  },

  getUsername() {
    return localStorage.getItem("chat-username");
  },

  saveUsername(name) {
    localStorage.setItem("chat-username", name);
  },

  echoKey: "echo-memory",

  getMemory() {
    return JSON.parse(localStorage.getItem(this.echoKey)) || {};
  },

  saveMemory(memory) {
    localStorage.setItem(this.echoKey, JSON.stringify(memory));
  },
};