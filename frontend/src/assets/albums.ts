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
      name: "ye",
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
  ] as const;