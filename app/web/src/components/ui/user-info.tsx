import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface UserSideBarInfoProps {
  name: string;
  email: string;
}

export const UserSideBar = ({ name, email }: UserSideBarInfoProps) => {
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
};
