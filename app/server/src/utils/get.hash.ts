import { hashPassword } from './password.utils';

const getHashedPass = async (pass: string) => {
  const hash = await hashPassword(pass);

  console.log(hash);
};

getHashedPass('senhafoda123');
