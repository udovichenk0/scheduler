import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
