export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const renderLine = (line, index) => {
    // Check if line has markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const hasLinks = linkRegex.test(line);

    if (hasLinks) {
      const parts = [];
      let lastIndex = 0;
      let match;
      linkRegex.lastIndex = 0; // Reset regex

      while ((match = linkRegex.exec(line)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add the link
        parts.push(
          <a
            key={`link-${index}-${match.index}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1.5 transition-colors no-underline hover:underline"
          >
            {match[1]}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <div key={index} className="font-sans text-gray-900 leading-7 mb-4 text-base">
          {parts}
        </div>
      );
    }

    // Handle bold headings/intro lines
    if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
      return (
        <h3 key={index} className="font-sans font-bold text-2xl text-gray-900 mt-8 mb-5 first:mt-0 tracking-tight">
          {line.replace(/\*\*/g, "")}
        </h3>
      );
    }

    // Handle numbered list items (improved formatting)
    const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
    if (numberedMatch) {
      // Check if it has bold text (song/movie/book name)
      const boldMatch = numberedMatch[2].match(/\*\*([^*]+)\*\*/);
      
      return (
        <div key={index} className="flex gap-4 mb-4 group hover:bg-gray-50 p-4 rounded-xl transition-all border-l-4 border-transparent hover:border-blue-200">
          <span className="font-sans font-bold text-lg text-gray-500 flex-shrink-0 min-w-[2.5rem] pt-0.5">{numberedMatch[1]}.</span>
          <div className="flex-1 font-sans text-gray-900 leading-7 text-base">
            {boldMatch ? (
              <>
                <span className="font-bold text-gray-900 text-lg">{boldMatch[1]}</span>
                <span className="text-gray-700">{numberedMatch[2].replace(/\*\*[^*]+\*\*/, "")}</span>
              </>
            ) : (
              numberedMatch[2]
            )}
          </div>
        </div>
      );
    }

    // Regular text (intro paragraphs, descriptions)
    if (line.trim()) {
      // Check if it's an intro line (usually first line or short)
      const isIntro = index < 3 && line.length < 150 && !line.match(/^\d+\./);
      
      return (
        <div key={index} className={`font-sans leading-7 mb-4 text-base ${isIntro ? 'text-gray-700 text-lg' : 'text-gray-800'}`}>
          {line}
        </div>
      );
    }

    return <div key={index} className="mb-3"></div>;
  };

  return (
    <div className="font-sans antialiased space-y-1">
      {content.split("\n").map((line, index) => renderLine(line, index))}
    </div>
  );
}

