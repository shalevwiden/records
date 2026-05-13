// albums.ts

import { images } from "./images";

export const albums = [
  {
    id: "igor",
    name: "IGOR",
    artist: "Tyler, The Creator",
    cover: images.albums.igor,
  },
  {
    id: "deadbeat",
    name: "Deadbeat",
    artist: "Tame Impala",
    cover: images.albums.deadbeat,
  },
  {
    id: "abbeyroad",
    name: "Abbey Road",
    artist: "The Beatles",
    cover: images.albums.abbeyroad,
  },
  {
    id: "1989",
    name: "1989",
    artist: "Taylor Swift",
    cover: images.albums.album1989,
  },
  {
    id: "currents",
    name: "Currents",
    artist: "Tame Impala",
    cover: images.albums.currents,
  },
  {
    id: "ye",
    name: "Ye",
    artist: "Kanye West",
    cover: images.albums.ye,
  },
  {
    id: "darksideofthemoon",
    name: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    cover: images.albums.darkSideOfTheMoon,
  },
  {
    id: "pinktape",
    name: "Pink Tape",
    artist: "Lil Uzi Vert",
    cover: images.albums.pinkTape,
  },
  {
    id: "ghoststories",
    name: "Ghost Stories",
    artist: "Coldplay",
    cover: images.albums.ghostStories,
  },
  {
    id: "graduation",
    name: "Graduation",
    artist: "Kanye West",
    cover: images.albums.graduation,
  },

  // added albums

  {
    id: "thriller",
    name: "Thriller",
    artist: "Michael Jackson",
    cover: images.albums.thriller,
  },
  {
    id: "hitmehardandsoft",
    name: "Hit Me Hard and Soft",
    artist: "Billie Eilish",
    cover: images.albums.hitMeHardAndSoft,
  },
  {
    id: "theartofloving",
    name: "The Art of Loving",
    artist: "Olivia Dean",
    cover: images.albums.theArtOfLoving,
  },
  {
    id: "theromantic",
    name: "The Romantic",
    artist: "Bruno",
    cover: images.albums.theRomantic,
  },
  {
    id: "debitirar",
    name: "Debí Tirar Más Fotos",
    artist: "Bad Bunny",
    cover: images.albums.debiTirar,
  },
  {
    id: "decide",
    name: "DECIDE",
    artist: "Djo",
    cover: images.albums.decide,
  },
] as const;

export const albumMap = Object.fromEntries(
  albums.map((a) => [a.id, a]),
) as Record<string, (typeof albums)[number]>;
