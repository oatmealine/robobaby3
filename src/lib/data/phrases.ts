/* eslint-disable quotes */
/* eslint-disable max-len */
export interface IPhraseIO {
  input: string[];
  output: string[];
  chance?: number;
}

export const reactionPhrases: Array<IPhraseIO> = [
  {
    input: ["robobaby", "robo-baby"],
    output: ["😉", "😍", "😘", "😜", "😝", "😎", "😏", "😒", "😓", "😔", "😖", "😞", "😣", "😢", "😭", "😨", "😩", "😫", "😬", "😰", "😱", "😲", "😳", "😶"],
    chance: 0.5,
  },
  { input: ["butt"], output: ["🍑"] },
  { input: ["crab"], output: ["🦀"] },
  { input: ["should i", "am i", "can i", "what do you think"], output: ["👍", "👎"], chance: 0.75 },
];

export const responsePhrases: Array<IPhraseIO> = [
  {
    input: ["crab dancing to chiptune"],
    output: ["https://youtu.be/j_d_4CnuqZQ"],
  },
  { input: ["who is robo", "who is robo-baby", "who is robobaby"], output: ["https://youtu.be/QY4AAos0daI"] },
  {
    input: ["godmode chant"],
    output: ["It's a mod for pro 😁\nI love god\nI love godmode 😮\nIt's nice mode"],
  },
  { input: ["who is robo", "who is robo-baby", "who is robobaby"], output: ["https://youtu.be/QY4AAos0daI"] },
  {
    input: ["exigua chant"],
    output: [
      'you say "stole". OK...\ni say "draw".\ni\'m not a programmer, i\'m not a game designer;\ni\'m only a gamer.\nnot a *youtuber*, not a twitcher, not a clown.\nonly a gamer.\n**END**.',
    ],
  },
];
