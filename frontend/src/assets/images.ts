import smallLogo from "./images/smalllogo.png";
import bigLogo from "./images/biglogo.png";
import igor from "../assets/images/albums/igor.jpg";
import deadbeat from "../assets/images/albums/deadbeat.webp";
import abbeyroad from "../assets/images/albums/abbeyroad.jpg";
import album1989 from "../assets/images/albums/1989.png";
import currents from "../assets/images/albums/currents.png";
import ye from "../assets/images/albums/ye.jpg";
import darkSideOfTheMoon from "../assets/images/albums/darksideofthemoon.png";
import pinkTape from "../assets/images/albums/pinktape.png";
import ghostStories from "../assets/images/albums/ghoststories.png";

export const images = {
  logos: {
    small: smallLogo,
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
  },
} as const;

export type ImageKey = keyof typeof images;

