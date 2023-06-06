export function isTokenInHeader(req: Request) {
  const [type, token] = req.headers['authorization'].split(' ');
  if (type === 'Bearer' && token) {
    return token;
  }
}
