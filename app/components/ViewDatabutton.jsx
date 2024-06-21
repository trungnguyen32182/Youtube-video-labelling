"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const ViewDataButton = () => {
  const { data: session } = useSession();
  const page = "/pages/Dataset";

  if (session && session.user) {
    return (
      <div className=" right-5 top-5">
        <Link href={page} passHref>
          <button className="text-white py-1 px-5 border-2 rounded-full border-white"
          onClick={() => {
            console.log(page);
          }}
          >
            View Data
          </button>
        </Link>
      </div>
    );
  }

  return null;
};

export default ViewDataButton;
