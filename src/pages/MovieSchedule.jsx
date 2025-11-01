import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateNewReleases } from "../services/gemini";
import ProfessionalResponse from "../components/ProfessionalResponse";

export default function MovieSchedule() {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [scheduledMovies, setScheduledMovies] = useState([]);
  const [unscheduledMovies, setUnscheduledMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    fetchMovies();
  }, [navigate]);

  const fetchMovies = async () => {
    if (!auth.currentUser) return;

    try {
      const moviesRef = collection(db, "users", auth.currentUser.uid, "movies");
      const q = query(moviesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const moviesData = [];
      snapshot.forEach((doc) => {
        moviesData.push({ id: doc.id, ...doc.data() });
      });
      
      setAllMovies(moviesData);
      
      // Separate scheduled and unscheduled
      const scheduled = moviesData.filter(m => m.scheduledDate);
      const unscheduled = moviesData.filter(m => !m.scheduledDate);
      
      // Sort scheduled by date
      scheduled.sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return a.scheduledDate.localeCompare(b.scheduledDate);
      });
      
      setScheduledMovies(scheduled);
      setUnscheduledMovies(unscheduled);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setAllMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm("Remove from list?")) return;

    try {
      const ref = doc(db, "users", auth.currentUser.uid, "movies", movieId);
      await deleteDoc(ref);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleAutoGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateNewReleases(10);
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating:", error);
      alert("Failed to generate movies. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading your movies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-5xl mr-4">🎬</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Movie Schedule</h1>
                  <p className="text-blue-100 text-lg">{allMovies.length} movies in your list</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {generating ? "🎬 Generating..." : "✨ Auto-Generate 10 New Releases"}
                </button>
                <button
                  onClick={() => navigate("/movie-ai")}
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  + Find Movies
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {generatedContent && (
              <div className="mb-8">
                <ProfessionalResponse content={generatedContent} type="movie" />
              </div>
            )}

            {allMovies.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🎞️</div>
                <p className="text-gray-500 text-xl mb-4">No movies in your list yet</p>
                <p className="text-gray-400 mb-8">Discover amazing movies to watch!</p>
                <button
                  onClick={() => navigate("/movie-ai")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-semibold transform hover:scale-105"
                >
                  Discover Movies
                </button>
              </div>
            ) : (
              <>
                {/* Scheduled Movies */}
                {scheduledMovies.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Scheduled to Watch ({scheduledMovies.length})
                    </h2>
                    <div className="space-y-4">
                      {scheduledMovies.map((movie) => (
                        <div
                          key={movie.id}
                          className="border-2 border-blue-300 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-blue-50 to-indigo-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-5xl">🎬</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{movie.title}</h3>
                                {movie.scheduledDateFormatted && (
                                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-semibold">{movie.scheduledDateFormatted}</span>
                                  </div>
                                )}
                                {movie.link && (
                                  <a
                                    href={movie.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                                    </svg>
                                    View on IMDb
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(movie.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors ml-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unscheduled Movies */}
                {unscheduledMovies.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      📋 Watchlist ({unscheduledMovies.length})
                    </h2>
                    <div className="space-y-4">
                      {unscheduledMovies.map((movie) => (
                        <div
                          key={movie.id}
                          className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-5xl">🎬</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{movie.title}</h3>
                                {movie.link && (
                                  <a
                                    href={movie.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                                    </svg>
                                    View on IMDb
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(movie.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors ml-4"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

