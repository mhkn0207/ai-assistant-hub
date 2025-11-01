import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generatePlaylist } from "../services/gemini";
import ProfessionalResponse from "../components/ProfessionalResponse";

export default function Playlist() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    fetchSongs();
  }, [navigate]);

  const fetchSongs = async () => {
    if (!auth.currentUser) return;

    try {
      const songsRef = collection(db, "users", auth.currentUser.uid, "songs");
      const q = query(songsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const songsData = [];
      snapshot.forEach((doc) => {
        songsData.push({ id: doc.id, ...doc.data() });
      });
      setSongs(songsData);
    } catch (error) {
      console.error("Error fetching songs:", error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (songId) => {
    if (!window.confirm("Remove from playlist?")) return;

    try {
      const ref = doc(db, "users", auth.currentUser.uid, "songs", songId);
      await deleteDoc(ref);
      fetchSongs();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleAutoGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generatePlaylist(20);
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating:", error);
      alert("Failed to generate playlist. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading your playlist...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
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
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-5xl mr-4">🎵</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">My Playlist</h1>
                  <p className="text-purple-100 text-lg">{songs.length} songs</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {generating ? "🎵 Generating..." : "✨ Auto-Generate 20 Songs"}
                </button>
                <button
                  onClick={() => navigate("/spotify-ai")}
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  + Add Songs
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {generatedContent && (
              <div className="mb-8">
                <ProfessionalResponse content={generatedContent} type="song" />
              </div>
            )}

            {songs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🎶</div>
                <p className="text-gray-500 text-xl mb-4">Your playlist is empty</p>
                <p className="text-gray-400 mb-8">Start adding songs from Spotify AI!</p>
                <button
                  onClick={() => navigate("/spotify-ai")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-semibold transform hover:scale-105"
                >
                  Discover Music
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    className="border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-purple-50 to-pink-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl font-bold text-purple-600 flex-shrink-0 w-12 text-center pt-1">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{song.title}</h3>
                        {song.link && (
                          <a
                            href={song.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                            </svg>
                            Open in Spotify
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

