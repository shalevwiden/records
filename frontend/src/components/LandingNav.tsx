import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { images } from "../assets/images";

export default function LandingNav() {
  const { token } = useAuth();

  return (
    <header className="landing-nav-wrap">
      <nav className="landing-nav" aria-label="Primary">
        <Link to="/" className="landing-brand">
          <img className="landing-logo-image" src={images.logos.small} alt="Records logo" />
          <span className="landing-brand-text">
            Records
            <small>Log and share albums and songs</small>
          </span>
        </Link>
        <div className="landing-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/library">Library</Link>
          {token ? (
            <Link to="/library" className="landing-btn-primary">
              Open app
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="landing-btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
