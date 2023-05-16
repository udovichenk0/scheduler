import * as bcrypt from 'bcrypt';

export const compareHash = async (comparedHash: string, password: string) => {
  const hash = await bcrypt.compare(password, comparedHash);
  return hash;
};
