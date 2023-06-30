/* eslint-disable indent */
export interface SpritesMap {
  'common': "arrow"|"calendar"|"cloud"|"done"|"inbox"|"mail"|"palette"|"plus"|"settings"|"star"|"upcoming";
  'eye': "close"|"open";
}
export const SPRITES_META: { [K in keyof SpritesMap]: SpritesMap[K][]; } = {
  'common': ["arrow","calendar","cloud","done","inbox","mail","palette","plus","settings","star","upcoming"],'eye': ["close","open"]
};