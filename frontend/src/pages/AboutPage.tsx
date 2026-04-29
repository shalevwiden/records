import React from "react";
import LandingNav from "../components/LandingNav";
import SiteFooter from "../components/SiteFooter";
import "../landing.css";

export default function AboutPage() {
  return (
    <div className="landing-page">
      <LandingNav />
      <main className="landing-main">
        <article className="landing-about">
          <h1>About mycool album app</h1>
          <p className="lead">
            Records is our take on a social layer for people who actually finish albums — a place to log
            what you heard, leave a honest note, and peek at friends&apos; shelves without algorithms
            shouting over the music.
          </p>
          <h2>Why we built it</h2>
          <p>
            Streaming apps remember your playlists, but they rarely help you reflect. mycool album app
            started as a weekend project: a single page to star records and jot down a sentence after each
            listen. It grew into something we wanted to use every week — lightweight, readable, and a little
            nostalgic like flipping through a physical collection.
          </p>
          <h2>What you can do</h2>
          <p>
            Add albums and tracks to your library, attach short reviews, and keep a running history of
            what you have on repeat. Your profile becomes a snapshot of your taste — not a performance,
            just an honest shelf. When you follow people you trust, their updates feel like
            recommendations from a friend, not a billboard.
          </p>
          <h2>Our values</h2>
          <p>
            We bias toward calm interfaces, owner-controlled data, and respect for artists. There are no
            engagement tricks here — no autoplay rabbit holes or infinite comment wars. If you care about
            liner notes, deep cuts, and the story behind a session, you are the audience we had in mind.
          </p>
          <h2>What is next</h2>
          <p>
            We are iterating in public: better import tools, richer metadata, and gentle notifications when
            someone you follow drops a thoughtful review. If mycool album app sounds like your kind of slow
            social network, create an account and bring a few records with you. The shelf is yours to curate.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
