import { useState } from "react";
import { Github, Search, ArrowRight, User, AlertCircle, Star, GitFork, Code, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GitHubAnalyzerLanding() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }
    navigate(`/dashboard/${username}`);
    console.log(`Navigating to dashboard for: ${username}`);
  };

  const sampleMetrics = [
    { label: "Total Repositories", value: "150+", icon: <Database className="w-4 h-4" /> },
    { label: "Total Stars", value: "5.2K", icon: <Star className="w-4 h-4" /> },
    { label: "Lines of Code", value: "50K+", icon: <Code className="w-4 h-4" /> },
    { label: "Pull Requests", value: "300+", icon: <GitFork className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Github className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            GitHub
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {" "}Contribution
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-6">
            Comprehensive analysis of developer impact and contributions
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
              <User className="w-6 h-6 mr-2" />
              Enter Your GitHub Username
            </h2>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Github className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., octocat"
                  className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
              </div>
              
              {error && (
                <div className="flex items-center text-red-400 bg-red-900/20 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={loading || !username.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center text-lg disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analyze My Profile
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-gray-400 text-sm text-center mt-4">
              We'll analyze your public GitHub data to create comprehensive insights
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            Try with Popular Profiles
          </h3>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {['torvalds', 'gaearon', 'sindresorhus', 'tj'].map((user) => (
              <button
                key={user}
                onClick={() => setUsername(user)}
                className="bg-gray-800/70 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 border border-gray-600 hover:border-blue-500 transform hover:scale-105 hover:shadow-lg"
              >
                @{user}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            GitHub Contribution Analyzer © 2025 • Built with ❤️ for developers
          </p>
        </footer>
      </div>
    </div>
  );
}