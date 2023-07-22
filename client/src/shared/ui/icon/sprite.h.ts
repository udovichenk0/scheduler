
  export interface SpritesMap {
    'common': "arrow"|"calendar"|"cloud"|"done"|"filled-star"|"inbox"|"mail"|"outlined-star"|"palette"|"plus"|"settings"|"upcoming"|"eye-closed"|"eye-opened";
  }

  export const SPRITES_META: { [K in keyof SpritesMap]: SpritesMap[K][]; } = {
    'common': ["arrow","calendar","cloud","done","filled-star","inbox","mail","outlined-star","palette","plus","settings","upcoming","eye-closed","eye-opened"]
  };
  