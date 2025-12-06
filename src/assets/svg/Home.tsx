import React from "react";

interface HomeProps {
  fill?: string;
}

const Home: React.FC<HomeProps> = ({ fill }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: fill }}
    >
      <rect x="5" y="5" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="5" y="14" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
};

export default Home;