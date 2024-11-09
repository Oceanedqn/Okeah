import React from 'react';
import { UserCardProps } from '../types'; // importer l'interface depuis types/index.d.ts

const UserCard: React.FC<UserCardProps> = ({ name, age }) => {
  return (
    <div>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
    </div>
  );
};

export default UserCard;