import { useState } from "react";
import RecommendationCard from "./RecommendationCard";

export default function ProfessionalResponse({ content, type = "song" }) {
  if (!content) return null;

  // Parse content into sections
  const lines = content.split("\n").filter(line => line.trim());
  
  // Find intro line (usually first line without number)
  const introLine = lines.find(line => !line.match(/^\d+\./) && line.length < 200);
  const introIndex = introLine ? lines.indexOf(introLine) : -1;
  
  // Extract numbered items
  const items = lines.filter(line => line.match(/^\d+\./));
  
  // Other text (tips, descriptions)
  const otherLines = lines.filter((line, idx) => 
    !line.match(/^\d+\./) && idx !== introIndex
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200">
      {/* Intro */}
      {introLine && (
        <div className="mb-8 pb-6 border-b border-gray-200">
          <p className="font-sans text-xl text-gray-800 leading-relaxed font-medium">
            {introLine.replace(/\*\*/g, "")}
          </p>
        </div>
      )}

      {/* Recommendations List */}
      {items.length > 0 && (
        <div className="mb-6">
          <h3 className="font-sans font-bold text-lg text-gray-900 mb-4">
            {type === "song" && "🎵 Recommendations"}
            {type === "movie" && "🎬 Recommendations"}
            {type === "book" && "📚 Recommendations"}
            {type === "sport" && "🏆 Upcoming Matches"}
          </h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <RecommendationCard
                key={index}
                item={item}
                index={index + 1}
                type={type}
              />
            ))}
          </div>
        </div>
      )}

      {/* Additional text (tips, etc.) */}
      {otherLines.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {otherLines.map((line, index) => (
            <p key={index} className="font-sans text-base text-gray-600 leading-relaxed mb-2">
              {line.replace(/\*\*/g, "")}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

