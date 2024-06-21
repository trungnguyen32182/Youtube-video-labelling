"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className=" right-5 top-5">
        <button onClick={() => signOut()} className="text-white py-1 px-5 border-2 rounded-full border-white">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className=" right-5 top-5">
      <button onClick={() => signIn()} className="text-white py-1 px-5 border-2 rounded-full border-white">
        Sign In
      </button>
    </div>
  );
};

export default SigninButton;