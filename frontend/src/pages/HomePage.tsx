import React from "react";
import { Link } from "react-router-dom";
import LandingNav from "../components/LandingNav";
import SiteFooter from "../components/SiteFooter";
import "../landing.css";
import { useAuth } from "../hooks/useAuth";
import { albums } from "../assets/albums";

const BOBBING_ALBUMS: {
  top: string;
  left: string;
  r: string;
  d: string;
  albumIndex: number;
}[] = [
  { top: "8%", left: "4%", r: "-12deg", d: "0s", albumIndex: 0 },
  { top: "18%", left: "78%", r: "8deg", d: "0.4s", albumIndex: 1 },
  { top: "52%", left: "8%", r: "6deg", d: "0.8s", albumIndex: 2 },
  { top: "62%", left: "82%", r: "-9deg", d: "1.1s", albumIndex: 0 },
  { top: "28%", left: "58%", r: "14deg", d: "0.2s", albumIndex: 1 },
  { top: "72%", left: "38%", r: "-7deg", d: "1.4s", albumIndex: 2 },
  { top: "12%", left: "42%", r: "-5deg", d: "0.6s", albumIndex: 0 },
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
                    backgroundImage: `url(${albums[a.albumIndex % albums.length].cover})`,
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
              Records is a home for your listening history: log and review albums, see what your friends are listening to,
              and keep a running history of what you have on repeat.
              
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
              {albums.map((album) => (
                <article key={album.id} className="landing-card" role="listitem">
                  <div
                    className="landing-card-cover"
                    style={{ backgroundImage: `url(${album.cover})` }}
                    role="img"
                    aria-label={`${album.name} by ${album.artist}`}
                  />
                  <h3 className="landing-card-title">{album.name}</h3>
                  <p className="landing-card-artist">{album.artist}</p>
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
