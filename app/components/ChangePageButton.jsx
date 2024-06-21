"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const ChangePageButton = () => {
  const pathname = usePathname();
  const [page, setPage] = useState("");

  useEffect(() => {
    if (pathname === "/pages/Commentspage") {
      setPage("/pages/Transcriptspage");
    } else {
      setPage("/pages/Commentspage");
    }
  }, [pathname]);

  return (
    <>
      <Link href={page}>
        <button
          className="change-type-button text-white mt-5 py-1 px-5 border-2 rounded-full border-white"
        >
          Change analysis type
        </button>
      </Link>
    </>
  );
};

export default ChangePageButton;
