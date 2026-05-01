import React from "react";
import { Navigate, NavLink, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LibraryPage from "./pages/LibraryPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import { images } from "./assets/images";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, token } = useAuth();
  if (!ready) return <div className="container">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function NavItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `app-nav-link${isActive ? " is-active" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function FeedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M21 17c0-2.2-1.8-4-4-4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function AppShell() {
  const { logout, user } = useAuth();
  const initial = (user?.username || "?").trim().charAt(0).toUpperCase();
  const displayName = user?.username || "Guest";

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <Link to="/" className="app-brand">
            <img className="logo-image" src={images.logos.small} alt="Records logo" />
            <div className="app-brand-text">
              <span className="app-brand-name">Records</span>
              <span className="app-brand-sub">Log and share albums and songs</span>
            </div>
          </Link>

          <nav className="app-nav" aria-label="Primary">
            <NavItem to="/library" label="Library" icon={<LibraryIcon />} />
            <NavItem to="/feed" label="Feed" icon={<FeedIcon />} />
            <NavItem to="/profile" label="Profile" icon={<ProfileIcon />} />
          </nav>

          <div className="app-actions">
            {user ? (
              <>
                <span className="app-userchip" title={displayName}>
                  <span className="app-userchip-avatar">{initial}</span>
                  <span>@{displayName}</span>
                </span>
                <button className="btn btn-danger" onClick={logout} type="button">
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/library" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
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
