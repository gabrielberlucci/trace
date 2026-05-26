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
