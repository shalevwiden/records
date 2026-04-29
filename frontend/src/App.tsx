import React from "react";
import { Navigate, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LibraryPage from "./pages/LibraryPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, token } = useAuth();
  if (!ready) return <div className="container">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppShell() {
  const { logout, user } = useAuth();
  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <div className="logo" />
          <div>
            <div>Records</div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 650 }}>
              Log and share albums and songs
            </div>
          </div>
        </div>

        <div className="nav">
          <Link to="/library">Library</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/profile">Profile</Link>
          {user ? (
            <button className="btn btn-danger" onClick={logout} type="button">
              Logout
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/library" replace />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

