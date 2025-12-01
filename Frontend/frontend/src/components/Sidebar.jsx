import React, { useContext } from "react";
import { ChatContext } from "../App";

export default function Sidebar({ activeId, setActiveId }) {
  const { conversations, addConversation, deleteConversation } =
    useContext(ChatContext);

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <button
          onClick={addConversation}
          className="w-full bg-black text-white px-3 py-2 rounded"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 && (
          <p className="p-4 text-gray-600">No conversations</p>
        )}

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`p-3 cursor-pointer border-b 
                ${
                  activeId === c.id
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
          >
            <div className="flex justify-between items-center">
              <span>{c.title || "Untitled Chat"}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(c.id);
                }}
                className="text-xs text-red-600 px-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
