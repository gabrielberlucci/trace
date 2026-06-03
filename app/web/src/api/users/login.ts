import type { UserLoginPayload, UserLoginToken } from '@/types';
import axios from 'axios';

export const loginUser = async (
  data: UserLoginPayload,
): Promise<UserLoginToken> => {
  const response = await axios.post<UserLoginToken>(
    `${import.meta.env.VITE_BASE_URL}/users/login`,
    data,
  );

  return response.data;
};
