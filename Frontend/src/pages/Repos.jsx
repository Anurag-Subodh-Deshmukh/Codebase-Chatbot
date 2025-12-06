import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { repoAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function Repos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      loadRepos();
    }
  }, [user]);

  const loadRepos = async () => {
    try {
      const data = await repoAPI.getAllRepos(user.email);
      setRepos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load repos:', error);
      setRepos([]);
    }
  };

  const handleAddRepo = async (e) => {
    e.preventDefault();
    setError('');
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }
    setLoading(true);
    try {
      await repoAPI.saveRepo(user.email, repoUrl.trim());
      setRepoUrl('');
      await loadRepos(); // Reload repos
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add repository');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRepo = async (repoId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this repository?')) {
      return;
    }
    setLoading(true);
    try {
      await repoAPI.deleteRepo(repoId);
      await loadRepos(); // Reload repos
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to remove repository');
    } finally {
      setLoading(false);
    }
  };

  const handleRepoClick = (repoId) => {
    navigate(`/chat/${repoId}`);
  };

  const getRepoName = (repoUrl) => {
    if (!repoUrl) return 'Repository';
    const parts = repoUrl.split('/');
    return parts[parts.length - 1] || parts[parts.length - 2] || 'Repository';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Repositories</h1>
          <p className="text-zinc-400">Add repositories to start chatting about your codebase</p>
        </div>

        {/* Add Repo Form */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Repository</h2>
          <form onSubmit={handleAddRepo} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-medium disabled:opacity-50 transition-colors"
              >
                {loading ? 'Adding...' : 'Add Repository'}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Repos Grid */}
        {repos.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-zinc-600 mb-4">
              <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-zinc-400 text-lg">No repositories yet</p>
            <p className="text-zinc-600 text-sm mt-2">Add your first repository to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.repo_id}
                onClick={() => handleRepoClick(repo.repo_id)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 cursor-pointer transition-all hover:shadow-lg group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-white transition-colors">
                      {getRepoName(repo.repo_url)}
                    </h3>
                    <p className="text-zinc-500 text-sm truncate">{repo.repo_url}</p>
                  </div>
                  <button
                    onClick={(e) => handleRemoveRepo(repo.repo_id, e)}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                    title="Remove repository"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <span>Click to chat</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

