import { useState } from "react";
import { summarizeText, generateQuiz, answerQuestion } from "../services/gemini";

export default function NoteEditor({ noteText, setNoteText, summary, setSummary, quiz, setQuiz, onSave }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState({ summarize: false, quiz: false, answer: false });

  const handleSummarize = async () => {
    if (!noteText.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }
    setLoading((prev) => ({ ...prev, summarize: true }));
    try {
      const result = await summarizeText(noteText);
      setSummary(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, summarize: false }));
    }
  };

  const handleGenerateQuiz = async () => {
    if (!noteText.trim()) {
      alert("Please enter some text to generate a quiz from.");
      return;
    }
    setLoading((prev) => ({ ...prev, quiz: true }));
    try {
      const result = await generateQuiz(noteText);
      setQuiz(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, quiz: false }));
    }
  };

  const handleAnswerQuestion = async () => {
    if (!noteText.trim() || !question.trim()) {
      alert("Please enter both note text and a question.");
      return;
    }
    setLoading((prev) => ({ ...prev, answer: true }));
    try {
      const result = await answerQuestion(noteText, question);
      setAnswer(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, answer: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Notes
        </label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type or paste your notes here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSummarize}
          disabled={loading.summarize}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.summarize ? "⏳ Summarizing..." : "✨ Summarize"}
        </button>
        <button
          onClick={handleGenerateQuiz}
          disabled={loading.quiz}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.quiz ? "⏳ Generating..." : "🧩 Generate Quiz"}
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          💾 Save Note
        </button>
      </div>

      {summary && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">✨ Summary</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {quiz && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">🧩 Quiz</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{quiz}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">❓ Ask a Question</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your notes..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAnswerQuestion();
              }
            }}
          />
          <button
            onClick={handleAnswerQuestion}
            disabled={loading.answer}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.answer ? "⏳ Thinking..." : "Get Answer"}
          </button>
        </div>
        {answer && (
          <div className="mt-4 p-3 bg-white rounded border border-blue-300">
            <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

