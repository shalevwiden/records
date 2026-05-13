// images.ts

import smallLogo from "./images/smalllogo.png";
import bigLogo from "./images/biglogo.png";
import smallLogom12 from "./images/may12logo.png";

// now albums
import igor from "../assets/images/albums/igor.jpg";
import deadbeat from "../assets/images/albums/deadbeat.webp";
import abbeyroad from "../assets/images/albums/abbeyroad.jpg";
import album1989 from "../assets/images/albums/1989.png";
import currents from "../assets/images/albums/currents.png";
import ye from "../assets/images/albums/ye.jpg";
import darkSideOfTheMoon from "../assets/images/albums/darksideofthemoon.png";
import pinkTape from "../assets/images/albums/pinktape.png";
import ghostStories from "../assets/images/albums/ghoststories.png";
import graduation from "../assets/images/albums/graduation.jpeg";

// missing albums
import thriller from "../assets/images/albums/thriller.png";
import hitMeHardAndSoft from "../assets/images/albums/hitmehardandsoft.png";
import theArtOfLoving from "../assets/images/albums/theartofloving.png";
import theRomantic from "../assets/images/albums/theromantic.png";
import debiTirar from "../assets/images/albums/debitirar.png";
import decide from "../assets/images/albums/decide.png";

export const images = {
  logos: {
    small: smallLogom12,
    big: bigLogo,
  },

  albums: {
    igor,
    deadbeat,
    abbeyroad,
    album1989,
    currents,
    ye,
    darkSideOfTheMoon,
    pinkTape,
    ghostStories,
    graduation,

    // added
    thriller,
    hitMeHardAndSoft,
    theArtOfLoving,
    theRomantic,
    debiTirar,
    decide,
  },
} as const;

export type ImageKey = keyof typeof images;
