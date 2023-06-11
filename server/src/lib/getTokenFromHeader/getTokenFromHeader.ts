import { Request } from 'express';

export function getTokenFromHeader(req: Request) {
  const header = req.headers['authorization']?.split(' ');
  if (header && header[0] === 'Bearer' && header[1]) {
    return header[1];
  }
}
