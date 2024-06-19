import React from "react";
import SignIn from "./SignIn";
import Logo from "./Logo"
const Appbar = () => {
  return (
    <header className="relative bg-transparent flex flex-row justify-between items-center px-4 py-2 z-50">
      <Logo/>
      <SignIn />
    </header>
  );
};

export default Appbar;
