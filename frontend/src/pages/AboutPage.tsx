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
          <h1>About Records</h1>
          <p className="lead">
            Records is our take on a social layer for people who actually finish
            albums — a place to log what you heard, leave a honest note, and
            peek at friends&apos; shelves without algorithms shouting over the
            music.
          </p>
          <h2>Why we built it</h2>
          <p>
            Streaming apps remember your playlists, but they rarely help you
            reflect. This site can be used as a way to remember the first
            experience (or 100th) of listening to something - and leaving some
            thoughts too. We hope this is lightweight, readable, and a little
            nostalgic like flipping through a physical collection.
          </p>
          <h2>What you can do</h2>
          <p>
            Add albums and tracks to your library, attach short reviews, and
            keep a running history of what you have on repeat. Your profile
            becomes a snapshot of your taste — not a performance, just an honest
            shelf. Follow your friends and see what they are listening to and
            what they recommend.
          </p>
          <h2>Values</h2>
          <p>
            We care about engaging with music more intentionally. Records is
            built around the idea of finishing albums, sitting with them, and
            forming your own perspective.
            <br />
            <br />
            Appreciating music as a form of art.
            <br />
            <br />
            We also value simplicity. Your profile isn’t meant to be a
            performance or a feed to optimize — it’s just a personal record of
            what you’ve heard and what it meant to you.
          </p>
          <h2>What is next</h2>
          The goal is to keep improving the experience without losing what makes
          it simple. That includes refining the interface, making interactions
          smoother, and continuing to build out the core features around logging
          and discovery.
          <br />
          <br />
          On the technical side, this project is also a way to keep developing
          both frontend and backend systems — experimenting with new ideas,
          improving performance, and making the platform more scalable over
          time.{" "}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
