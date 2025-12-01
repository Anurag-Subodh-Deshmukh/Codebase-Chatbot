import React, { createContext, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import GithubURLInput from "./components/GitHubURLInput";

import { loadHistory, saveHistory, newConversationId } from "./utils/history";

export const ChatContext = createContext();

export default function App() {
  const [conversations, setConversations] = useState(loadHistory());
  const [activeId, setActiveId] = useState(conversations[0]?.id || null);

  // 🔥 NEW: state to track github URL validation
  const [githubURL, setGithubURL] = useState(null);

  useEffect(() => {
    saveHistory(conversations);
  }, [conversations]);

  function addConversation() {
    const id = newConversationId();
    const conv = { id, title: "New Conversation", messages: [] };

    setConversations((prev) => [conv, ...prev]);
    setActiveId(id);
  }

  function updateConversation(id, patch) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function deleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(conversations[0]?.id || null);
    }
  }

  const activeConversation =
    conversations.find((c) => c.id === activeId) || null;

  // 🔥 NEW: Handle GitHub URL validation
  const handleGithubURL = (url) => {
    // Basic validation
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/?$/;

    if (!githubRegex.test(url)) {
      alert("Invalid GitHub Repository URL!");
      return;
    }

    // Store the verified URL → now show chatbot UI
    setGithubURL(url);
  };

  // 🔥 If GitHub URL not yet validated → ONLY show URL input screen
  if (!githubURL) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Enter GitHub Repository URL
          </h2>

          <GithubURLInput onSubmit={handleGithubURL} />

          <p className="text-center text-gray-600 text-sm mt-3">
            Example: https://github.com/username/repository
          </p>
        </div>
      </div>
    );
  }

  // 🔥 If URL is valid → NOW load ChatGPT-like interface
  return (
    <ChatContext.Provider
      value={{
        conversations,
        updateConversation,
        activeConversation,
        addConversation,
        deleteConversation,
        githubURL, // repo URL available for chatbot
      }}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar activeId={activeId} setActiveId={setActiveId} />

          <main className="flex-1 p-4">
            {activeConversation ? (
              <div className="flex flex-col h-full rounded-lg shadow bg-white dark:bg-gray-800 overflow-hidden">
                <ChatWindow />
                <ChatInput />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No conversation selected.
              </div>
            )}
          </main>
        </div>
      </div>
    </ChatContext.Provider>
  );
}
