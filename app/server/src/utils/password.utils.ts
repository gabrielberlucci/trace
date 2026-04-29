import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  return hash;
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const valid = await bcrypt.compare(password, hash);

  return valid;
};
