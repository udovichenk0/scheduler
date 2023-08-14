import { randomInt } from 'crypto';

export function randomCode() {
  return randomInt(1000_000).toString().padStart(6, '0');
}
