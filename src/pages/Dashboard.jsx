import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import AIAssistantCard from "../components/AIAssistantCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    // Load notes in background without blocking the page
    const fetchNotes = async () => {
      try {
        const notesRef = collection(db, "users", auth.currentUser.uid, "notes");
        const q = query(notesRef, orderBy("createdAt", "desc"));
        
        // Try with a timeout, but don't block the UI
        const querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
        ]);

        const notesData = [];
        querySnapshot.forEach((docSnapshot) => {
          notesData.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        setNotes(notesData);
      } catch (error) {
        // Firestore not set up yet - this is OK, user can still use AI features
        setNotes([]);
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const noteRef = doc(db, "users", auth.currentUser.uid, "notes", noteId);
      await deleteDoc(noteRef);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleCreateNote = () => {
    navigate("/note/new");
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* AI Assistants Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">✨ AI Assistants</h2>
          <p className="text-gray-600 mb-6">Discover music, movies, books, and sports matches tailored to your interests</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AIAssistantCard
              title="Spotify AI"
              icon="🎧"
              description="Get personalized music recommendations based on your mood, genre, or activity."
              gradient="from-purple-500 via-pink-500 to-red-500"
              onClick={() => navigate("/spotify-ai")}
            />
            <AIAssistantCard
              title="Movie AI"
              icon="🎬"
              description="Find your next favorite movie or TV show with AI-powered suggestions."
              gradient="from-blue-500 via-indigo-500 to-purple-500"
              onClick={() => navigate("/movie-ai")}
            />
            <AIAssistantCard
              title="Book AI"
              icon="📚"
              description="Discover books and novels that match your reading preferences and interests."
              gradient="from-amber-500 via-orange-500 to-red-500"
              onClick={() => navigate("/book-ai")}
            />
            <AIAssistantCard
              title="Sports AI"
              icon="⚽"
              description="Discover upcoming cricket, football, and other sports matches and tournaments."
              gradient="from-green-500 via-emerald-500 to-teal-500"
              onClick={() => navigate("/sports-ai")}
            />
          </div>
          
          {/* List Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <button
              onClick={() => navigate("/playlist")}
              className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl hover:shadow-lg transition-all text-left border-2 border-purple-200 hover:border-purple-400"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">🎵</span>
                <h3 className="font-bold text-lg text-gray-900">My Playlist</h3>
              </div>
              <p className="text-gray-600 text-sm">Manage your saved songs</p>
            </button>
            <button
              onClick={() => navigate("/movie-schedule")}
              className="p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl hover:shadow-lg transition-all text-left border-2 border-blue-200 hover:border-blue-400"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">🎬</span>
                <h3 className="font-bold text-lg text-gray-900">Movie Schedule</h3>
              </div>
              <p className="text-gray-600 text-sm">Schedule movies to watch</p>
            </button>
            <button
              onClick={() => navigate("/reading-list")}
              className="p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl hover:shadow-lg transition-all text-left border-2 border-amber-200 hover:border-amber-400"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">📚</span>
                <h3 className="font-bold text-lg text-gray-900">Reading List</h3>
              </div>
              <p className="text-gray-600 text-sm">Track books to read</p>
            </button>
            <button
              onClick={() => navigate("/sports-schedule")}
              className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl hover:shadow-lg transition-all text-left border-2 border-green-200 hover:border-green-400"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">🏆</span>
                <h3 className="font-bold text-lg text-gray-900">Sports Schedule</h3>
              </div>
              <p className="text-gray-600 text-sm">Track matches & tournaments</p>
            </button>
          </div>
        </div>

        {/* Study Notes Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">📝 My Study Notes</h2>
              <p className="text-gray-600">Manage your notes and use AI to summarize, quiz, and learn</p>
            </div>
            <button
              onClick={handleCreateNote}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
            >
              + Create New Note
            </button>
          </div>

          {notesLoading ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border-2 border-gray-200">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border-2 border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg mb-4">No notes yet. Create your first note to get started!</p>
              <button
                onClick={handleCreateNote}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-semibold"
              >
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={() => handleDeleteNote(note.id)}
                  onClick={() => handleNoteClick(note.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

