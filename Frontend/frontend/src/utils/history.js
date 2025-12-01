export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("chat_history_v1")) || [];
  } catch {
    return [];
  }
}

export function saveHistory(data) {
  localStorage.setItem("chat_history_v1", JSON.stringify(data));
}

export function newConversationId() {
  return "conv_" + Date.now().toString(36);
}
