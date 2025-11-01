import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Navbar from "../components/Navbar";
import NoteEditor from "../components/NoteEditor";
import { serverTimestamp } from "firebase/firestore";

export default function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewNote = id === "new";

  const [noteText, setNoteText] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    if (!isNewNote) {
      const fetchNote = async () => {
        try {
          const noteRef = doc(db, "users", auth.currentUser.uid, "notes", id);
          const noteSnap = await getDoc(noteRef);

          if (noteSnap.exists()) {
            const data = noteSnap.data();
            setNoteText(data.noteText || "");
            setSummary(data.summary || "");
            setQuiz(data.quiz || "");
            setCreatedAt(data.createdAt);
          } else {
            alert("Note not found.");
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching note:", error);
          alert("Failed to load note.");
          navigate("/dashboard");
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    } else {
      setLoading(false);
    }
  }, [id, isNewNote, navigate]);

  const handleSave = async () => {
    if (!noteText.trim()) {
      alert("Please enter some text before saving.");
      return;
    }

    setSaving(true);
    try {
      const noteData = {
        noteText: noteText.trim(),
        summary: summary || "",
        quiz: quiz || "",
        updatedAt: serverTimestamp(),
      };

      if (isNewNote) {
        noteData.createdAt = serverTimestamp();
      } else if (createdAt) {
        noteData.createdAt = createdAt;
      }

      if (isNewNote) {
        const notesRef = collection(db, "users", auth.currentUser.uid, "notes");
        const newNoteRef = doc(notesRef);
        await setDoc(newNoteRef, noteData);
        navigate(`/note/${newNoteRef.id}`);
      } else {
        const noteRef = doc(db, "users", auth.currentUser.uid, "notes", id);
        await setDoc(noteRef, noteData, { merge: true });
        alert("Note saved successfully!");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading note...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <NoteEditor
            noteText={noteText}
            setNoteText={setNoteText}
            summary={summary}
            setSummary={setSummary}
            quiz={quiz}
            setQuiz={setQuiz}
            onSave={handleSave}
          />
          {saving && (
            <div className="mt-4 text-center text-blue-600">💾 Saving...</div>
          )}
        </div>
      </div>
    </div>
  );
}

