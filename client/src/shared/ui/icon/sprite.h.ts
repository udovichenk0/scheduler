
export interface SpritesMap {
    'common': "arrow"|"calendar"|"cloud"|"done"|"inbox"|"plus"|"settings"|"star"|"upcoming";
'eye': "close"|"open";
  }

export const SPRITES_META: { [K in keyof SpritesMap]: SpritesMap[K][]; } = {
  'common': ["arrow","calendar","cloud","done","inbox","plus","settings","star","upcoming"],'eye': ["close","open"]
};
  