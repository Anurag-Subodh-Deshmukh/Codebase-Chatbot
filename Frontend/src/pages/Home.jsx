import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Understand{' '}
            <span className="bg-gradient-to-r from-green-400 via-teal-300 to-blue-400 text-transparent bg-clip-text">
              Anything
            </span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12">
            Your research and coding partner, powered by intelligent insights from your codebase.
          </p>

          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
              >
                Try CodebaseLM
              </Link>

              
            </div>
          )}

          {isAuthenticated && (
            <Link
              to="/repos"
              className="inline-block px-8 py-3 bg-white text-black font-medium rounded-xl transition-all hover:bg-zinc-200"
            >
              Go to Repositories
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
