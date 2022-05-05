export interface PhraseIO {
  input: string[];
  output: string[];
  chance?: number;
}

export const reactionPhrases: Array<PhraseIO> = [
  {
    input: ["robobaby", "robo-baby"],
    output: ["😉", "😍", "😘", "😜", "😝", "😎", "😏", "😒", "😓", "😔", "😖", "😞", "😣", "😢", "😭", "😨", "😩", "😫", "😬", "😰", "😱", "😲", "😳", "😶"],
    chance: 0.5,
  },
  { input: ["butt"], output: ["🍑"] },
  { input: ["crab"], output: ["🦀"] },
  { input: ["should i", "am i", "can i", "what do you think"], output: ["👍", "👎"], chance: 0.75 },
];

export const responsePhrases: Array<PhraseIO> = [
  {
    input: ["crab dancing to chiptune"],
    output: ["https://youtu.be/j_d_4CnuqZQ"],
  },
  { input: ["who is robo", "who is robo-baby", "who is robobaby"], output: ["https://youtu.be/QY4AAos0daI"] },
  {
    input: ["godmode chant"],
    output: ["It's a mod for pro 😁\nI love god\nI love godmode 😮\nIt's nice mode"],
  },
];
