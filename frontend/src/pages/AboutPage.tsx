import React from "react";
import LandingNav from "../components/LandingNav";
import SiteFooter from "../components/SiteFooter";
import { images } from "../assets/images";
import "../landing.css";

export default function AboutPage() {
  return (
    <div className="landing-page">
      <LandingNav />
      <main className="landing-main">
        <div className="landing-about-logo-wrap">
          <img
            className="landing-about-logo-img"
            src={images.logos.big}
            alt="Records"
            decoding="async"
          />
        </div>
        <article className="landing-about">
          <h1>About Records</h1>
          <p className="lead">
            Records is a take on a social layer for people who actually finish
            albums — a place to log what you heard, leave a honest note, and
            peek at friends&apos; listening history without algorithms.
          </p>
          <h2>Why was it built?</h2>
          <p>
            This site can be used as a way to remember the first experience (or
            100th) of listening to something - and leaving some thoughts too.
            The aim was to be lightweight, readable, and a little nostalgic like
            flipping through a physical collection.
          </p>
          <h2>What you can do</h2>
          <p>
            Add albums and tracks to your library, attach short reviews, and
            keep a running history what you've listened to. Your profile becomes
            a snapshot.
          </p>
          <h2>Values</h2>
          <p>
            Engaging with music more intentionally. Records is built around the
            idea of finishing full albums.
            <br />
            <br />
            Appreciating music as a form of art.
            <br />
            <br />
          </p>
          <h2>What is next</h2>
          Future updates could consist of refining the interface, making
          interactions smoother, and continuing to build out the core features
          around logging and discovery.
          <br />
          <br />
          On the technical side, this project is also a way to keep developing
          both frontend and backend systems as well as the PostgreSQL database -
          experimenting with new ideas, iterating on features, and improving
          performance.
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
