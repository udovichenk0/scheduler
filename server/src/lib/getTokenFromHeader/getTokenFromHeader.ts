import { Request } from 'express';

export function getTokenFromHeader(req: Request) {
  const [type, token] = req.headers['authorization'].split(' ');
  if (type === 'Bearer' && token) {
    return token;
  }
}
