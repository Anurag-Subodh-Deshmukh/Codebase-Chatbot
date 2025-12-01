import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../App";

export default function ChatWindow() {
  const { activeConversation } = useContext(ChatContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {activeConversation?.messages?.map((msg, index) => (
        <div
          key={index}
          className={`mb-3 flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] px-4 py-2 rounded-lg shadow text-sm 
              ${
                msg.role === "user"
                  ? "bg-black text-white" // user = black bubble
                  : "bg-white text-black border"
              }  // assistant = white bubble with border
            `}
          >
            {msg.text}
          </div>
        </div>
      ))}

      <div ref={bottomRef}></div>
    </div>
  );
}
