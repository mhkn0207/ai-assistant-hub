import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CalendarScheduler from "../components/CalendarScheduler";

export default function MyLists() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("songs");
  const [songs, setSongs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    fetchLists();
  }, [navigate]);

  const fetchLists = async () => {
    if (!auth.currentUser) return;

    try {
      // Fetch songs
      const songsRef = collection(db, "users", auth.currentUser.uid, "songs");
      const songsQuery = query(songsRef, orderBy("createdAt", "desc"));
      const songsSnapshot = await getDocs(songsQuery);
      const songsData = [];
      songsSnapshot.forEach((doc) => {
        songsData.push({ id: doc.id, ...doc.data() });
      });
      setSongs(songsData);

      // Fetch movies
      const moviesRef = collection(db, "users", auth.currentUser.uid, "movies");
      const moviesQuery = query(moviesRef, orderBy("createdAt", "desc"));
      const moviesSnapshot = await getDocs(moviesQuery);
      const moviesData = [];
      moviesSnapshot.forEach((doc) => {
        moviesData.push({ id: doc.id, ...doc.data() });
      });
      setMovies(moviesData);

      // Fetch books
      const booksRef = collection(db, "users", auth.currentUser.uid, "books");
      const booksQuery = query(booksRef, orderBy("createdAt", "desc"));
      const booksSnapshot = await getDocs(booksQuery);
      const booksData = [];
      booksSnapshot.forEach((doc) => {
        booksData.push({ id: doc.id, ...doc.data() });
      });
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Remove this item from your list?")) return;

    try {
      const ref = doc(db, "users", auth.currentUser.uid, `${type}s`, id);
      await deleteDoc(ref);
      fetchLists();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleSchedule = async (itemId, type, date, formattedDate) => {
    try {
      const ref = doc(db, "users", auth.currentUser.uid, `${type}s`, itemId);
      await updateDoc(ref, {
        scheduledDate: date,
        scheduledDateFormatted: formattedDate,
      });
      fetchLists();
    } catch (error) {
      console.error("Error scheduling:", error);
      alert("Failed to schedule. Please try again.");
    }
  };

  const currentList = activeTab === "songs" ? songs : activeTab === "movies" ? movies : books;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading your lists...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">📋 My Lists</h1>
            <p className="text-blue-100">Manage your saved songs, movies, and books</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("songs")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "songs"
                  ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              🎵 Songs ({songs.length})
            </button>
            <button
              onClick={() => setActiveTab("movies")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "movies"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              🎬 Movies ({movies.length})
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "books"
                  ? "bg-amber-50 text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              📚 Books ({books.length})
            </button>
          </div>

          {/* List Content */}
          <div className="p-8">
            {currentList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === "songs" && "🎵"}
                  {activeTab === "movies" && "🎬"}
                  {activeTab === "books" && "📚"}
                </div>
                <p className="text-gray-500 text-lg mb-2">No {activeTab} saved yet</p>
                <p className="text-gray-400">Start adding items from AI recommendations!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentList.map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        {item.scheduledDateFormatted && (
                          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Scheduled: {item.scheduledDateFormatted}
                          </div>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                          >
                            Open Link
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <CalendarScheduler
                          type={activeTab.slice(0, -1)}
                          onSchedule={(date, formatted) => {
                            handleSchedule(item.id, activeTab.slice(0, -1), date, formatted);
                          }}
                        />
                        <button
                          onClick={() => handleDelete(item.id, activeTab.slice(0, -1))}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
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

