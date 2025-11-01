export default function NoteCard({ note, onDelete, onClick }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const preview = note.noteText?.substring(0, 100) || "Empty note...";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
      <div onClick={onClick}>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {note.noteText?.substring(0, 50) || "Untitled Note"}
          {note.noteText?.length > 50 ? "..." : ""}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{preview}...</p>
        <p className="text-xs text-gray-400">{formatDate(note.createdAt)}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="mt-3 w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
      >
        Delete
      </button>
    </div>
  );
}

