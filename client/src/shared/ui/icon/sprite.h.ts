
  export interface SpritesMap {
    'common': "arrow"|"calendar"|"cloud"|"done"|"eye-closed"|"eye-opened"|"filled-star"|"inbox"|"mail"|"outlined-star"|"palette"|"plus"|"settings"|"upcoming"|"timer"|"reset";
  }

  export const SPRITES_META: { [K in keyof SpritesMap]: SpritesMap[K][]; } = {
    'common': ["arrow","calendar","cloud","done","eye-closed","eye-opened","filled-star","inbox","mail","outlined-star","palette","plus","settings","upcoming","timer","reset"]
  };
  