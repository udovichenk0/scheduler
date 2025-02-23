import { z } from "zod";

export const boolStr = z.custom<string>((val) => {
  return val === "true" || val === "false"
}).transform((v) => v === "true");