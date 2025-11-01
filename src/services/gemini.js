const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Use v1 API with gemini-2.5-flash (newest flash model)
// Alternative: gemini-2.5-pro or gemini-1.5-pro
const getGeminiApiUrl = (model = "gemini-2.5-flash") => {
  return `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
};

const GEMINI_API_URL = getGeminiApiUrl();

export async function summarizeText(text) {
  if (!text.trim()) {
    return "Please enter some text to summarize.";
  }

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Summarize this text in a clear and concise way:\n\n${text}` }] }],
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Error generating summary. Please check your API key and try again.";
  }
}

export async function generateQuiz(text) {
  if (!text.trim()) {
    return "Please enter some text to generate a quiz from.";
  }

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create 5 quiz questions with answers from this text. Format each question with "Q: [question]" and "A: [answer]" on separate lines:\n\n${text}` }] }],
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No quiz generated.";
  } catch (error) {
    console.error("Error generating quiz:", error);
    return "Error generating quiz. Please check your API key and try again.";
  }
}

export async function answerQuestion(noteText, question) {
  if (!noteText.trim() || !question.trim()) {
    return "Please provide both note text and a question.";
  }

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Based on this text:\n\n${noteText}\n\nAnswer this question: ${question}` }] }],
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";
  } catch (error) {
    console.error("Error answering question:", error);
    return "Error answering question. Please check your API key and try again.";
  }
}

export async function getSpotifyRecommendations(query) {
  if (!query.trim()) {
    return "Please provide a mood, genre, or activity to get music recommendations.";
  }

  const prompt = `You are a professional music curator. Recommend 8-10 songs for: "${query}"

Format as numbered list (1-10):
1. **Song Name** by Artist (Year) - Brief description - [Spotify Link](https://open.spotify.com/search/[song]%20[artist])

Start with one engaging intro line.
End with a brief tip about when to listen (e.g., "Perfect for morning workouts!" or "Great for late-night studying").

User request: ${query}`;

  try {
    // Check if API key is available
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.";
    }

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });


    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Could not parse error response" }));
      console.error("Full API Error Response:", JSON.stringify(errorData, null, 2));
      
      // Provide more helpful error messages
      if (res.status === 400) {
        return `⚠️ Bad Request (400): ${errorData.error?.message || "Invalid request format. Check console for details."}`;
      } else if (res.status === 401 || res.status === 403) {
        return `⚠️ Authentication Error (${res.status}): Invalid API key or insufficient permissions. Please verify your API key.`;
      } else if (res.status === 404) {
        return `⚠️ Not Found (404): Model not available. Please check if your API key has access to gemini-pro model.`;
      } else if (res.status === 429) {
        return `⚠️ Rate Limit (429): Too many requests. Please wait a moment and try again.`;
      }
      
      throw new Error(`API error: ${res.status} - ${errorData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    
    // Check for API errors in response
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `⚠️ API Error: ${data.error.message || "Unknown error"}. Please check your API key and permissions.`;
    }
    
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) {
      console.error("No candidates in response:", data);
      return "⚠️ No response generated. Please try again or check the browser console for details.";
    }
    
    return result;
  } catch (error) {
    console.error("Error getting Spotify recommendations:", error);
    return `⚠️ Error: ${error.message || "Failed to generate recommendations"}. Please check your API key and try again. Check browser console (F12) for more details.`;
  }
}

export async function getMovieRecommendations(query) {
  if (!query.trim()) {
    return "Please provide a genre, vibe, or situation to get movie recommendations.";
  }

  const prompt = `You are a professional film critic. Recommend 8-10 movies/TV shows for: "${query}"

Format as numbered list (1-10):
1. **Title** (Year) - Brief summary - [IMDb Link](https://www.imdb.com/find?q=[title])

Start with one engaging intro line.
Include one hidden gem recommendation.
End with a brief suggestion about when to watch (e.g., "Perfect for a cozy weekend!" or "Great for date night!").

User request: ${query}`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(`API error: ${res.status} - ${errorData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `⚠️ API Error: ${data.error.message || "Unknown error"}. Please check your API key and permissions.`;
    }
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendations generated.";
  } catch (error) {
    console.error("Error getting movie recommendations:", error);
    return `⚠️ Error: ${error.message || "Failed to generate recommendations"}. Please check your API key and try again.`;
  }
}

export async function getBookRecommendations(query) {
  if (!query.trim()) {
    return "Please provide a genre, theme, or emotion to get book recommendations.";
  }

  const prompt = `You are a professional literary curator. Recommend 8-10 books for: "${query}"

Format as numbered list (1-10):
1. **Book Title** by Author (Year) - Brief summary - [Goodreads Link](https://www.goodreads.com/search?q=[book title])

Start with one engaging intro line.
Include one must-read classic.
End with a brief suggestion about when to read (e.g., "Perfect for vacation reading!" or "Great for daily commute!").

User request: ${query}`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(`API error: ${res.status} - ${errorData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `⚠️ API Error: ${data.error.message || "Unknown error"}. Please check your API key and permissions.`;
    }
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendations generated.";
  } catch (error) {
    console.error("Error getting book recommendations:", error);
    return `⚠️ Error: ${error.message || "Failed to generate recommendations"}. Please check your API key and try again.`;
  }
}

// Sports AI function
export async function getSportsRecommendations(query) {
  if (!query.trim()) {
    return "Please provide a sport or tournament to get match recommendations.";
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const formattedDate = `${currentMonth}/${currentDay}/${currentYear}`;

  const prompt = `You are a professional sports analyst. Recommend ONLY UPCOMING/FUTURE matches and tournaments for: "${query}"

CRITICAL DATE FILTER: Today's date is ${formattedDate}. 
- ONLY include matches scheduled for dates AFTER ${formattedDate}
- Do NOT include any matches from June 2024, July 2024, or any past dates
- Only show matches from ${currentMonth}/${currentDay}/${currentYear} onwards
- Focus on matches happening in the next 1-6 months (${currentYear} and early ${currentYear + 1})

Format as numbered list (1-10):
1. **Match/Tournament Name** - Date/Location - Brief description - [ESPN Link](https://www.espn.com/search/results?q=[match name])

Include:
- ONLY future matches with dates after ${formattedDate}
- Recent tournaments and upcoming seasons
- Dates and venues
- Key teams/players to watch
- Brief highlights about why it's worth watching

Start with one engaging intro line.
End with a brief suggestion about where to watch (e.g., "Catch these on ESPN!" or "Available on streaming platforms!").

User request: ${query}`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file and restart the server.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(`API error: ${res.status} - ${errorData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `⚠️ API Error: ${data.error.message || "Unknown error"}. Please check your API key and permissions.`;
    }
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendations generated.";
  } catch (error) {
    console.error("Error getting sports recommendations:", error);
    return `⚠️ Error: ${error.message || "Failed to generate recommendations"}. Please check your API key and try again.`;
  }
}

// Bulk generation functions
export async function generatePlaylist(count = 20) {
  const prompt = `Generate a curated playlist of exactly ${count} diverse songs.

Format as numbered list (1-${count}):
1. **Song Name** by Artist (Year) - Brief description - [Spotify Link](https://open.spotify.com/search/[song]%20[artist])

Include: Mix of genres, new releases and classics, different moods/tempos.
Start with: "Here's your curated playlist of ${count} amazing songs!"`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No playlist generated.";
  } catch (error) {
    console.error("Error generating playlist:", error);
    return `⚠️ Error: ${error.message || "Failed to generate playlist"}.`;
  }
}

export async function generateNewReleases(count = 10) {
  const prompt = `Generate exactly ${count} recently released movies (2024-2025).

Format as numbered list (1-${count}):
1. **Title** (Year) - Brief summary - [IMDb Link](https://www.imdb.com/find?q=[title])

Include: Latest theatrical releases, streaming originals, acclaimed films, variety of genres.
Start with: "Here are ${count} must-watch new releases!"`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No movies generated.";
  } catch (error) {
    console.error("Error generating new releases:", error);
    return `⚠️ Error: ${error.message || "Failed to generate movies"}.`;
  }
}

export async function generateNewBooks(count = 5) {
  const prompt = `Generate exactly ${count} recently released books (2024-2025).

Format as numbered list (1-${count}):
1. **Book Title** by Author (Year) - Brief summary - [Goodreads Link](https://www.goodreads.com/search?q=[book title])

Include: Latest fiction, bestselling authors, award-winners, variety of genres.
Start with: "Here are ${count} captivating new books to read!"`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No books generated.";
  } catch (error) {
    console.error("Error generating new books:", error);
    return `⚠️ Error: ${error.message || "Failed to generate books"}.`;
  }
}

export async function generateSportsMatches(count = 15) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const formattedDate = `${currentMonth}/${currentDay}/${currentYear}`;

  const prompt = `Generate exactly ${count} UPCOMING/FUTURE sports matches and tournaments across different sports.

CRITICAL DATE FILTER: Today's date is ${formattedDate}.
- ONLY include matches scheduled for dates AFTER ${formattedDate}
- Do NOT include matches from June 2024, July 2024, or any past months/years
- Only show matches from ${formattedDate} onwards (${currentYear} and ${currentYear + 1})
- Focus on upcoming tournaments and future seasons

Format as numbered list (1-${count}):
1. **Match/Tournament Name** - Date/Location - Brief description - [ESPN Link](https://www.espn.com/search/results?q=[match name])

Include:
- Cricket (upcoming IPL ${currentYear + 1}, T20 World Cup ${currentYear + 1}, Test series - future dates only)
- Football (upcoming World Cup qualifiers, UEFA, Premier League ${currentYear}-${currentYear + 1} season - future dates only)
- Basketball (upcoming NBA ${currentYear}-${currentYear + 1} season, international tournaments - future dates only)
- Tennis (upcoming Grand Slams ${currentYear + 1}, ATP tours - future dates only)
- Other major sports with upcoming matches (all dates must be after ${formattedDate})
- Mix of dates and locations (all dates must be future)
- Key teams/players

Start with: "Here are ${count} exciting upcoming sports matches to watch!"`;

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key") {
      return "⚠️ Gemini API key is missing.";
    }

    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No matches generated.";
  } catch (error) {
    console.error("Error generating sports matches:", error);
    return `⚠️ Error: ${error.message || "Failed to generate matches"}.`;
  }
}

