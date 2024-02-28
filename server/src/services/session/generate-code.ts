import { randomInt } from "crypto";

export function generateCode() {
  return randomInt(1000_000).toString().padStart(6, "0");
}
