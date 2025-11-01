import { useState } from "react";

export default function CalendarScheduler({ onSchedule, type }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSchedule = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    
    try {
      const date = new Date(selectedDate + "T00:00:00");
      const formatted = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (onSchedule && typeof onSchedule === "function") {
        onSchedule(selectedDate, formatted);
      }
      setShowCalendar(false);
      setSelectedDate("");
    } catch (error) {
      console.error("Error scheduling:", error);
      alert("Invalid date. Please try again.");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const typeLabels = {
    song: { verb: "Listen", icon: "🎵" },
    movie: { verb: "Watch", icon: "🎬" },
    book: { verb: "Read", icon: "📚" },
    sport: { verb: "Watch", icon: "🏆" },
  };

  const labels = typeLabels[type] || typeLabels.song;

  return (
    <div className="relative">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {labels.icon} Schedule
      </button>

      {showCalendar && (
        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 min-w-[320px]">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {labels.verb} on:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSchedule}
              disabled={!selectedDate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Schedule
            </button>
            <button
              onClick={() => {
                setShowCalendar(false);
                setSelectedDate("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

