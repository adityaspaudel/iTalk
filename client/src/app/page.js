import React from "react";
import UserLogin from "./(auth)/login/page";

const Home = () => {
  return (
    <main className="flex justify-center items-center h-screen w-screen bg-amber-200">
      <UserLogin />
    </main>
  );
};

export default Home;
