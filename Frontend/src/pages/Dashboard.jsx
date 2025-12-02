import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { repoAPI, promptAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repoError, setRepoError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptError, setPromptError] = useState('');
  const [promptSuccess, setPromptSuccess] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (user?.email) {
      loadRepos();
    }
  }, [user]);

  const loadRepos = async () => {
    try {
      const data = await repoAPI.getRepo(user.email);
      if (data?.repos) setRepos(Array.isArray(data.repos) ? data.repos : []);
    } catch (error) {
      setRepos([]);
    }
  };

  const handleAddRepo = async (e) => {
    e.preventDefault();
    setRepoError('');
    if (!repoUrl.trim()) {
      setRepoError('Please enter a repository URL');
      return;
    }
    setLoading(true);
    try {
      const updatedRepos = [...repos, repoUrl.trim()];
      await repoAPI.saveRepo(user.email, updatedRepos);
      setRepos(updatedRepos);
      setRepoUrl('');
    } catch (error) {
      setRepoError(error.response?.data?.error || 'Failed to save repository');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRepo = async (index) => {
    setLoading(true);
    try {
      const updatedRepos = repos.filter((_, i) => i !== index);
      await repoAPI.saveRepo(user.email, updatedRepos);
      setRepos(updatedRepos);
    } catch (error) {
      setRepoError(error.response?.data?.error || 'Failed to remove repository');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    setPromptError('');
    setPromptSuccess(false);

    if (!prompt.trim()) {
      setPromptError('Please enter a prompt');
      return;
    }

    setPromptLoading(true);
    try {
      await promptAPI.savePrompt(user.email, prompt.trim());
      setPromptSuccess(true);
      setChatHistory([...chatHistory, { role: 'user', text: prompt }]);
      setPrompt('');
      setTimeout(() => setPromptSuccess(false), 3000);
    } catch (error) {
      setPromptError(error.response?.data?.error || 'Failed to save prompt');
    } finally {
      setPromptLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-72 bg-zinc-900 border-r border-zinc-800 p-5 flex flex-col gap-6 overflow-y-auto">
          <h2 className="text-lg font-semibold">Chats</h2>

          <div className="space-y-2">
            {chatHistory.length === 0 ? (
              <p className="text-zinc-600 text-sm">No chats yet</p>
            ) : (
              chatHistory.map((chat, i) => (
                <div key={i} className="p-3 bg-zinc-800 rounded-xl border border-zinc-700 text-sm truncate">
                  {chat.text}
                </div>
              ))
            )}
          </div>

          <h2 className="text-lg font-semibold mt-6">Repositories</h2>

          <form onSubmit={handleAddRepo} className="space-y-2">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-zinc-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-sm disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Repository'}
            </button>
          </form>

          {repoError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {repoError}
            </div>
          )}

          <div className="space-y-2">
            {repos.length === 0 ? (
              <p className="text-zinc-600 text-sm">No repositories added</p>
            ) : (
              repos.map((repo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-zinc-800 px-3 py-2 rounded-xl border border-zinc-700 text-sm"
                >
                  <span className="truncate w-44">{repo}</span>
                  <button
                    onClick={() => handleRemoveRepo(index)}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-zinc-950">

          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-zinc-600 mt-20">
                Start a conversation about your codebase
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-2xl p-4 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-zinc-800 ml-auto'
                      : 'bg-zinc-700 mr-auto'
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitPrompt} className="p-6 border-t border-zinc-800 bg-zinc-950">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something about your codebase..."
              rows="2"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-zinc-600 resize-none text-sm"
            />

            {promptError && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {promptError}
              </div>
            )}

            {promptSuccess && (
              <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs">
                Prompt saved
              </div>
            )}

            <button
              type="submit"
              disabled={promptLoading}
              className="w-full mt-4 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-medium disabled:opacity-50"
            >
              {promptLoading ? 'Saving...' : 'Send'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
