import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateNewBooks } from "../services/gemini";
import ProfessionalResponse from "../components/ProfessionalResponse";

export default function ReadingList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    if (!auth.currentUser) return;

    try {
      const booksRef = collection(db, "users", auth.currentUser.uid, "books");
      const q = query(booksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const booksData = [];
      snapshot.forEach((doc) => {
        booksData.push({ id: doc.id, ...doc.data() });
      });
      
      // Separate scheduled and unscheduled
      const scheduled = booksData.filter(b => b.scheduledDate);
      const unscheduled = booksData.filter(b => !b.scheduledDate);
      
      // Sort scheduled by date
      scheduled.sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return a.scheduledDate.localeCompare(b.scheduledDate);
      });
      
      setBooks([...scheduled, ...unscheduled]);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Remove from reading list?")) return;

    try {
      const ref = doc(db, "users", auth.currentUser.uid, "books", bookId);
      await deleteDoc(ref);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleAutoGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateNewBooks(5);
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating:", error);
      alert("Failed to generate books. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading your reading list...</div>
        </div>
      </div>
    );
  }

  const scheduledBooks = books.filter(b => b.scheduledDate);
  const unscheduledBooks = books.filter(b => !b.scheduledDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-5xl mr-4">📚</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Reading List</h1>
                  <p className="text-amber-100 text-lg">{books.length} books</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="px-6 py-3 bg-white text-amber-600 rounded-xl hover:bg-amber-50 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {generating ? "📚 Generating..." : "✨ Auto-Generate 5 New Books"}
                </button>
                <button
                  onClick={() => navigate("/book-ai")}
                  className="px-6 py-3 bg-white text-amber-600 rounded-xl hover:bg-amber-50 font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  + Find Books
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {generatedContent && (
              <div className="mb-8">
                <ProfessionalResponse content={generatedContent} type="book" />
              </div>
            )}

            {books.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">📖</div>
                <p className="text-gray-500 text-xl mb-4">Your reading list is empty</p>
                <p className="text-gray-400 mb-8">Discover your next great read!</p>
                <button
                  onClick={() => navigate("/book-ai")}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg font-semibold transform hover:scale-105"
                >
                  Discover Books
                </button>
              </div>
            ) : (
              <>
                {/* Scheduled Books */}
                {scheduledBooks.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Scheduled to Read ({scheduledBooks.length})
                    </h2>
                    <div className="space-y-4">
                      {scheduledBooks.map((book) => (
                        <div
                          key={book.id}
                          className="border-2 border-amber-300 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-r from-amber-50 to-orange-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-5xl">📖</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{book.title}</h3>
                                {book.scheduledDateFormatted && (
                                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-semibold">{book.scheduledDateFormatted}</span>
                                  </div>
                                )}
                                {book.link && (
                                  <a
                                    href={book.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-600 hover:text-amber-800 font-medium inline-flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                                    </svg>
                                    View on Goodreads
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(book.id)}
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

                {/* Unscheduled Books */}
                {unscheduledBooks.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      📚 Reading Queue ({unscheduledBooks.length})
                    </h2>
                    <div className="space-y-4">
                      {unscheduledBooks.map((book) => (
                        <div
                          key={book.id}
                          className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-5xl">📖</div>
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900 mb-2">{book.title}</h3>
                                {book.link && (
                                  <a
                                    href={book.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-600 hover:text-amber-800 font-medium inline-flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9-4.029 9-9 9zm-1-13h2v4h6v2h-6v4h-2v-4H5v-2h6V8z"/>
                                    </svg>
                                    View on Goodreads
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(book.id)}
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

