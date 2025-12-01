import React, { useState, useContext } from "react";
import { ChatContext } from "../App";

export default function ChatInput() {
  const { activeConversation, updateConversation } = useContext(ChatContext);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    updateConversation(activeConversation.id, {
      messages: [...activeConversation.messages, { role: "user", text }],
    });

    setText("");

    // mock assistant (you can hook your backend here)
    setTimeout(() => {
      updateConversation(activeConversation.id, {
        messages: [
          ...activeConversation.messages,
          { role: "user", text },
          { role: "assistant", text: "This is a sample response." },
        ],
      });
    }, 600);
  };

  return (
    <div className="p-3 bg-white border-t flex gap-2">
      <input
        className="flex-1 p-2 border rounded bg-white text-black"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Send
      </button>
    </div>
  );
}
