"use client"
import React from "react";
import SignIn from "./SignIn";
import Logo from "./Logo";
import ViewDataButton from "./ViewDataButton";
import { signIn, signOut, useSession } from "next-auth/react";
const Appbar = () => {
  const { data: session } = useSession();

  return (
    <header
      className="relative bg-transparent flex flex-row justify-between items-center px-4 py-2 z-50 "
      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
    >
      <Logo />
      {session && session.user ? (
        <div className="flex justify-between flex-wrap p-2 w-[20vw]">
          <ViewDataButton />
          <SignIn />
        </div>
      ) : (
        <SignIn />
      )}
    </header>
  );
};

export default Appbar;
