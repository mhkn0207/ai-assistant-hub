import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CalendarScheduler from "../components/CalendarScheduler";
import { generateSportsMatches } from "../services/gemini";
import ProfessionalResponse from "../components/ProfessionalResponse";

export default function SportsSchedule() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    fetchMatches();
  }, [navigate]);

  const fetchMatches = async () => {
    if (!auth.currentUser) return;

    try {
      const matchesRef = collection(db, "users", auth.currentUser.uid, "sports");
      const q = query(matchesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const matchesData = [];
      snapshot.forEach((doc) => {
        matchesData.push({ id: doc.id, ...doc.data() });
      });
      
      // Separate scheduled and unscheduled
      const scheduled = matchesData.filter(m => m.scheduledDate);
      const unscheduled = matchesData.filter(m => !m.scheduledDate);
      
      // Sort scheduled by date
      scheduled.sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return a.scheduledDate.localeCompare(b.scheduledDate);
      });
      
      setMatches([...scheduled, ...unscheduled]);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (matchId) => {
    if (!window.confirm("Remove from schedule?")) return;

    try {
      const ref = doc(db, "users", auth.currentUser.uid, "sports", matchId);
      await deleteDoc(ref);
      fetchMatches();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleSchedule = async (itemId, date, formatted) => {
    try {
      const ref = doc(db, "users", auth.currentUser.uid, "sports", itemId);
      await updateDoc(ref, {
        scheduledDate: date,
        scheduledDateFormatted: formatted,
      });
      fetchMatches();
    } catch (error) {
      console.error("Error scheduling:", error);
      alert("Failed to schedule. Please try again.");
    }
  };

  const handleNotify = async (matchId, currentNotification) => {
    try {
      const ref = doc(db, "users", auth.currentUser.uid, "sports", matchId);
      await updateDoc(ref, {
        notification: !currentNotification,
      });
      fetchMatches();
    } catch (error) {
      console.error("Error toggling notification:", error);
      alert("Failed to update notification. Please try again.");
    }
  };

  const handleAutoGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateSportsMatches(15);
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating:", error);
      alert("Failed to generate matches. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading your sports schedule...</div>
        </div>
      </div>
    );
  }

  const scheduledMatches = matches.filter(m => m.scheduledDate);
  const unscheduledMatches = matches.filter(m => !m.scheduledDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-5xl mr-4">🏆</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Sports Schedule</h1>
                  <p className="text-green-100 text-lg">{matches.length} matches saved</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {generating ? "🏆 Generating..." : "✨ Auto-Generate 15 Matches"}
                </button>
                <button
                  onClick={() => navigate("/sports-ai")}
                  className="px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  + Find Matches
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {generatedContent && (
              <div className="mb-8">
                <ProfessionalResponse content={generatedContent} type="sport" />
              </div>
            )}

            {matches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">⚽</div>
                <p className="text-gray-500 text-xl mb-4">No matches in your schedule yet</p>
                <p className="text-gray-400 mb-8">Discover exciting sports matches to watch!</p>
                <button
                  onClick={() => navigate("/sports-ai")}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold transform hover:scale-105"
                >
                  Find Matches
                </button>
              </div>
            ) : (
              <>
                {/* Scheduled Matches */}
                {scheduledMatches.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Scheduled Matches ({scheduledMatches.length})
                    </h2>
                    <div className="space-y-4">
                      {scheduledMatches.map((match) => (
                        <div
                          key={match.id}
                          className="border-2 border-green-300 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-green-50 to-emerald-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-5xl">🏆</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{match.title}</h3>
                                {match.scheduledDateFormatted && (
                                  <div className="flex items-center gap-2 text-green-600 mb-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-semibold">{match.scheduledDateFormatted}</span>
                                  </div>
                                )}
                                {match.link && (
                                  <a
                                    href={match.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                                    </svg>
                                    View Details
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleNotify(match.id, match.notification)}
                                className={`px-4 py-2 ${match.notification ? 'bg-green-600' : 'bg-gray-300'} text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors`}
                                title={match.notification ? "Notifications ON" : "Notifications OFF"}
                              >
                                🔔
                              </button>
                              <button
                                onClick={() => handleDelete(match.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unscheduled Matches */}
                {unscheduledMatches.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      📋 Watchlist ({unscheduledMatches.length})
                    </h2>
                    <div className="space-y-4">
                      {unscheduledMatches.map((match) => (
                        <div
                          key={match.id}
                          className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-5xl">🏆</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{match.title}</h3>
                                {match.link && (
                                  <a
                                    href={match.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                                    </svg>
                                    View Details
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <CalendarScheduler
                                type="sport"
                                onSchedule={(date, formatted) => handleSchedule(match.id, date, formatted)}
                              />
                              <button
                                onClick={() => handleNotify(match.id, match.notification)}
                                className={`px-4 py-2 ${match.notification ? 'bg-green-600' : 'bg-gray-300'} text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors`}
                                title={match.notification ? "Notifications ON" : "Notifications OFF"}
                              >
                                🔔
                              </button>
                              <button
                                onClick={() => handleDelete(match.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm transition-colors"
                              >
                                Remove
                              </button>
                            </div>
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

