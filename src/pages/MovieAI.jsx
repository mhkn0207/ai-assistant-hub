import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMovieRecommendations } from "../services/gemini";
import ProfessionalResponse from "../components/ProfessionalResponse";

export default function MovieAI() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "funny rom-coms",
    "thrilling action movies",
    "mind-bending sci-fi",
    "cozy weekend films",
    "date night movies",
    "family friendly",
    "dark thrillers",
    "inspirational dramas",
  ]);

  const handleGetRecommendations = async () => {
    if (!query.trim()) {
      alert("Please enter a genre, vibe, or situation (e.g., 'funny rom-coms', 'thrilling sci-fi', 'family weekend')");
      return;
    }

    setLoading(true);
    try {
      const result = await getMovieRecommendations(query);
      setRecommendations(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-gray-600 hover:text-gray-800 font-medium flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center mb-4">
              <div className="text-5xl mr-4">🎬</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Movie AI</h1>
                <p className="text-blue-100 text-lg">Your personal film and TV show guide</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What are you in the mood to watch?
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., funny rom-coms, thrilling sci-fi, family weekend, dark thriller..."
                  className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleGetRecommendations();
                    }
                  }}
                />
                <button
                  onClick={handleGetRecommendations}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Find Movies"
                  )}
                </button>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Quick Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(suggestion);
                        handleGetRecommendations();
                      }}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {recommendations && (
              <div className="mt-8">
                <ProfessionalResponse content={recommendations} type="movie" />
              </div>
            )}

            {!recommendations && !loading && (
              <div className="mt-12 text-center text-gray-400">
                <div className="text-6xl mb-4">🎞️</div>
                <p className="text-lg">Enter your movie preference above to discover your next favorite watch!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

