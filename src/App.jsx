import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotePage from "./pages/NotePage";
import SpotifyAI from "./pages/SpotifyAI";
import MovieAI from "./pages/MovieAI";
import BookAI from "./pages/BookAI";
import MyLists from "./pages/MyLists";
import Playlist from "./pages/Playlist";
import MovieSchedule from "./pages/MovieSchedule";
import ReadingList from "./pages/ReadingList";
import SportsAI from "./pages/SportsAI";
import SportsSchedule from "./pages/SportsSchedule";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/note/:id"
          element={user ? <NotePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/spotify-ai"
          element={user ? <SpotifyAI /> : <Navigate to="/login" />}
        />
        <Route
          path="/movie-ai"
          element={user ? <MovieAI /> : <Navigate to="/login" />}
        />
        <Route
          path="/book-ai"
          element={user ? <BookAI /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-lists"
          element={user ? <MyLists /> : <Navigate to="/login" />}
        />
        <Route
          path="/playlist"
          element={user ? <Playlist /> : <Navigate to="/login" />}
        />
        <Route
          path="/movie-schedule"
          element={user ? <MovieSchedule /> : <Navigate to="/login" />}
        />
        <Route
          path="/reading-list"
          element={user ? <ReadingList /> : <Navigate to="/login" />}
        />
        <Route
          path="/sports-ai"
          element={user ? <SportsAI /> : <Navigate to="/login" />}
        />
        <Route
          path="/sports-schedule"
          element={user ? <SportsSchedule /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

