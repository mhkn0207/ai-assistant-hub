import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function RecommendationCard({ 
  item, 
  index, 
  type, // 'movie', 'book', 'song'
  onAddToList 
}) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Extract title/name from the item text
  const extractTitle = (text) => {
    const boldMatch = text.match(/\*\*([^*]+)\*\*/);
    if (boldMatch) return boldMatch[1];
    const numberedMatch = text.match(/^\d+\.\s*(.+?)(?:\s*-\s*|$)/);
    if (numberedMatch) return numberedMatch[1].trim();
    return text.substring(0, 50);
  };

  // Extract link from markdown
  const extractLink = (text) => {
    const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
    return linkMatch ? linkMatch[2] : null;
  };

  const handleAddToList = async () => {
    if (!auth.currentUser) {
      alert("Please sign in to save items to your list.");
      return;
    }

    setAdding(true);
    try {
      const title = extractTitle(item);
      const link = extractLink(item);
      
      const itemData = {
        title: title,
        description: item,
        link: link || "",
        type: type,
        createdAt: serverTimestamp(),
        scheduledDate: null, // Can be set via calendar
      };

      const listRef = collection(db, "users", auth.currentUser.uid, `${type}s`);
      await addDoc(listRef, itemData);
      
      setAdded(true);
      if (onAddToList) onAddToList();
      
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Error adding to list:", error);
      
      // Check if it's a Firestore setup issue
      if (error.message && error.message.includes("400")) {
        alert("Firestore database not configured. Please set up Firestore in Firebase Console.\n\nThis feature requires Firestore to be enabled.");
      } else {
        alert("Failed to add to list. Please check your Firestore setup and try again.");
      }
    } finally {
      setAdding(false);
    }
  };

  // Different styling for each type
  const typeStyles = {
    song: {
      borderColor: "border-purple-300",
      hoverColor: "hover:bg-purple-50",
      numberColor: "text-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    movie: {
      borderColor: "border-blue-300",
      hoverColor: "hover:bg-blue-50",
      numberColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    book: {
      borderColor: "border-amber-300",
      hoverColor: "hover:bg-amber-50",
      numberColor: "text-amber-600",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
    },
    sport: {
      borderColor: "border-green-300",
      hoverColor: "hover:bg-green-50",
      numberColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
  };

  const styles = typeStyles[type] || typeStyles.song;

  return (
    <div className={`group border-2 ${styles.borderColor} ${styles.hoverColor} rounded-xl p-5 mb-4 transition-all duration-200 shadow-sm hover:shadow-md`}>
      <div className="flex gap-4 items-start">
        <span className={`font-bold text-xl ${styles.numberColor} flex-shrink-0 min-w-[2.5rem] pt-1`}>
          {index}.
        </span>
        <div className="flex-1">
          <div className="font-sans text-gray-900 leading-relaxed text-[15px]">
            {(() => {
              // Remove number prefix (e.g., "1. ")
              const cleanItem = item.replace(/^\d+\.\s*/, "");
              
              // Parse bold text and links
              const boldMatch = cleanItem.match(/\*\*([^*]+)\*\*/);
              const linkMatch = cleanItem.match(/\[([^\]]+)\]\(([^)]+)\)/);
              const restOfText = cleanItem
                .replace(/\*\*[^*]+\*\*/g, "")
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "")
                .trim();

              return (
                <div>
                  {boldMatch && (
                    <div className="font-bold text-lg text-gray-900 mb-1">
                      {boldMatch[1]}
                    </div>
                  )}
                  <div className="text-gray-700 leading-relaxed">
                    {restOfText && <span>{restOfText}</span>}
                    {linkMatch && (
                      <a
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold ml-2 inline-flex items-center gap-1 no-underline hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {linkMatch[1]}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <button
          onClick={handleAddToList}
          disabled={adding || added}
          className={`${styles.buttonColor} text-white px-4 py-2 rounded-lg font-medium text-sm transition-all flex-shrink-0 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
        >
          {added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </>
          ) : adding ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to List
            </>
          )}
        </button>
      </div>
    </div>
  );
}

