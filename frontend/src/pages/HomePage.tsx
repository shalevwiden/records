import React from "react";
import { Link } from "react-router-dom";
import LandingNav from "../components/LandingNav";
import SiteFooter from "../components/SiteFooter";
import "../landing.css";
import { useAuth } from "../hooks/useAuth";

const BOBBING_ALBUMS: {
  top: string;
  left: string;
  r: string;
  d: string;
  bg: string;
}[] = [
  { top: "8%", left: "4%", r: "-12deg", d: "0s", bg: "linear-gradient(145deg,#1a2a4a,#3d6b9a)" },
  { top: "18%", left: "78%", r: "8deg", d: "0.4s", bg: "linear-gradient(145deg,#3d1f2e,#c94b6a)" },
  { top: "52%", left: "8%", r: "6deg", d: "0.8s", bg: "linear-gradient(145deg,#2a1f3d,#8b5cf6)" },
  { top: "62%", left: "82%", r: "-9deg", d: "1.1s", bg: "linear-gradient(145deg,#1e3a2f,#34d399)" },
  { top: "28%", left: "58%", r: "14deg", d: "0.2s", bg: "linear-gradient(145deg,#4a3518,#f59e0b)" },
  { top: "72%", left: "38%", r: "-7deg", d: "1.4s", bg: "linear-gradient(145deg,#2d1b1b,#ef4444)" },
  { top: "12%", left: "42%", r: "-5deg", d: "0.6s", bg: "linear-gradient(145deg,#0f2942,#38bdf8)" },
];

const POPULAR: { title: string; artist: string; bg: string }[] = [
  { title: "The Dark Side of the Moon", artist: "Pink Floyd", bg: "linear-gradient(145deg,#1e293b,#6366f1)" },
  { title: "In Rainbows", artist: "Radiohead", bg: "linear-gradient(145deg,#422006,#f97316)" },
  { title: "IGOR", artist: "Tyler, The Creator", bg: "linear-gradient(145deg,#3b0764,#e879f9)" },
  { title: "Blonde", artist: "Frank Ocean", bg: "linear-gradient(145deg,#14532d,#86efac)" },
  { title: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", bg: "linear-gradient(145deg,#7f1d1d,#f87171)" },
  { title: "Random Access Memories", artist: "Daft Punk", bg: "linear-gradient(145deg,#0c4a6e,#38bdf8)" },
];

export default function HomePage() {
  const { token } = useAuth();

  return (
    <div className="landing-page">
      <LandingNav />
      <main className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-hero-title">
          <div className="landing-hero-glow" aria-hidden />
          <div className="landing-bobbing-layer" aria-hidden>
            {BOBBING_ALBUMS.map((a, i) => (
              <span
                key={i}
                className="landing-bob-album"
                style={
                  {
                    top: a.top,
                    left: a.left,
                    "--r": a.r,
                    "--d": a.d,
                    backgroundImage: a.bg,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div className="landing-hero-inner">
            <h1 id="landing-hero-title">
              Review your favorite albums. Catalog everything you listen to. Share your passion for music.
            </h1>
            <p className="landing-hero-lead">
              mycool album app is a calm home for your listening history — rate records, keep a personal
              library, and see what your circle is spinning without the noise of a traditional feed.
            </p>
            <div className="landing-hero-cta">
              {token ? (
                <Link to="/library" className="landing-btn-primary">
                  Go to your library
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="landing-btn-primary">
                    Join Records for free
                  </Link>
                  <Link to="/login" className="landing-btn-ghost">
                    Log in
                  </Link>
                </>
              )}
            </div>
            <p className="landing-hero-note">For music lovers. Built for focus, not for endless scrolling.</p>
          </div>
        </section>

        <section className="landing-section" aria-labelledby="popular-heading">
          <div className="landing-section-inner">
            <h2 id="popular-heading">Popular this week</h2>
            <div className="landing-scroll-row" role="list">
              {POPULAR.map((p) => (
                <article key={p.title} className="landing-card" role="listitem">
                  <div
                    className="landing-card-cover"
                    style={{ backgroundImage: p.bg }}
                    role="img"
                    aria-label={`${p.title} by ${p.artist}`}
                  />
                  <h3 className="landing-card-title">{p.title}</h3>
                  <p className="landing-card-artist">{p.artist}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
