import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI, promptAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function Chat() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);

  useEffect(() => {
    if (repoId) {
      loadChats();
    }
  }, [repoId]);

  useEffect(() => {
    if (activeChatId && activeChatId !== -1) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  const loadChats = async () => {
    setLoadingChats(true);
    try {
      const data = await chatAPI.getAllChats(repoId);
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load chats:', error);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  const loadMessages = async () => {
    if (!activeChatId || activeChatId === -1) return;
    try {
      const prompts = await promptAPI.getPrompts(activeChatId);
      if (Array.isArray(prompts)) {
        const formattedMessages = prompts.flatMap(prompt => [
          { id: `prompt-${prompt.prompt_id}`, role: 'user', content: prompt.prompt },
          ...(prompt.response ? [{ id: `response-${prompt.prompt_id}`, role: 'assistant', content: prompt.response }] : [])
        ]);
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(-1); // -1 means new chat, will be created when first message is sent
    setMessages([]);
  };

  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await promptAPI.savePrompt(
        activeChatId === -1 ? -1 : activeChatId,
        currentInput,
        parseInt(repoId)
      );

      // If new chat was created, update activeChatId
      if (activeChatId === -1 && response.chat_id) {
        setActiveChatId(response.chat_id);
        await loadChats();
      }
      
      // Reload messages to get the updated response
      setTimeout(async () => {
        const currentChatId = activeChatId === -1 ? response.chat_id : activeChatId;
        if (currentChatId) {
          setActiveChatId(currentChatId);
          await loadMessages();
        }
      }, 500);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      alert(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRepos = () => {
    navigate('/repos');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleBackToRepos}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors mb-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Repos
            </button>
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {loadingChats ? (
              <div className="text-center py-8 text-zinc-600 text-sm">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-sm">
                <p>No chats yet</p>
                <p className="mt-2">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.chat_id}
                    onClick={() => handleChatClick(chat.chat_id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeChatId === chat.chat_id
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <div className="truncate">
                      {chat.chat_title || `Chat ${chat.chat_id}`}
                    </div>
                    {chat.created_at && (
                      <div className="text-xs text-zinc-600 mt-1">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-zinc-950">
          {!activeChatId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-zinc-600 mb-4">
                  <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-zinc-300 mb-2">Start a new conversation</h2>
                <p className="text-zinc-600 mb-6">Click "New Chat" to begin asking questions about your repository</p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
                >
                  New Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-zinc-600">
                      <p className="text-lg mb-2">Start chatting</p>
                      <p className="text-sm">Ask questions about your codebase</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 max-w-3xl ${
                        message.role === 'user' ? 'ml-auto' : 'mr-auto'
                      }`}
                    >
                      <div
                        className={`flex-1 rounded-xl p-4 ${
                          message.role === 'user'
                            ? 'bg-zinc-800 ml-auto'
                            : 'bg-zinc-900 border border-zinc-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user' ? 'bg-zinc-700' : 'bg-zinc-800'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-1 text-sm">
                              {message.role === 'user' ? 'You' : 'Assistant'}
                            </div>
                            <div className="text-zinc-300 whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex gap-4 max-w-3xl mr-auto">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex-1">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-zinc-800 bg-zinc-950 p-4">
                <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
                  <div className="flex gap-4">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Ask something about your codebase..."
                      rows="1"
                      className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-700 focus:border-transparent resize-none text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

