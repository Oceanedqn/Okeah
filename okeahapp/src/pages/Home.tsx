import React from 'react';
import UserCard from '../components/UserCard';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home page.</p>
      <UserCard name='Oceane' age={25}></UserCard>
    </div>
  );
};

export default Home;