import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { prisma } from '../lib/prisma';
import { hashPassword } from '@/utils';

const createUser = async () => {
  const rl = readline.createInterface({ input, output });
  const username = await rl.question('Username: ');
  const name = await rl.question('Name: ');
  // min 8
  const password = await rl.question('Password: ');
  const roleId = await rl.question('Role: ');

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      username: username,
      name: name,
      password: hashedPassword,
      roleId: Number(roleId),
    },
  });

  rl.close();
};

createUser();
